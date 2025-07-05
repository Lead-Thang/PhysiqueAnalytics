"""
This module sets up a Flask application for analyzing body images using MediaPipe Pose.
It provides an /api/analyze-image endpoint to process images from Supabase storage and return
body metrics (PhysiqueMetrics) and AI feedback (DashboardAIFeedback) for the PhysiqueAnalytics frontend.
Integrates with Supabase for user authentication and storage.
"""

from flask import Flask, request, jsonify, Blueprint
from flask_cors import CORS
import mediapipe as mp
from mediapipe.python.solutions import pose as mp_pose
import numpy as np
from PIL import Image
import io
import logging
import os
from typing import Dict, Any, Tuple
import requests
from supabase import create_client, Client

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": os.getenv("CORS_ORIGINS", "http://localhost:3000")}})

# Configure logging
logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO"),
    format="%(asctime)s [%(levelname)s] %(message)s",
)

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
if not supabase_url or not supabase_key:
    raise ValueError("SUPABASE_URL and SUPABASE_KEY must be defined in environment variables")
supabase: Client = create_client(supabase_url, supabase_key)

# Initialize MediaPipe Pose
pose = mp_pose.Pose(static_image_mode=True, min_detection_confidence=0.5)

# Create a Blueprint
api = Blueprint("api", __name__)

@api.route("/health", methods=["GET"])
def health_check() -> Tuple[Dict[str, str], int]:
    """Health check endpoint."""
    return jsonify({"status": "ok"}), 200

def validate_image(image: Image.Image) -> None:
    """Validate image size and format."""
    valid_formats = {"JPEG", "PNG"}
    if image.format not in valid_formats:
        raise ValueError(f"Invalid image format. Supported formats: {', '.join(valid_formats)}")
    if image.size[0] * image.size[1] * 3 > 5 * 1024 * 1024:  # Approx 5MB
        raise ValueError("Image size exceeds 5MB limit")

def calculate_body_metrics(landmarks: Any) -> Dict[str, Any]:
    """Calculate body metrics from MediaPipe Pose landmarks."""
    if not landmarks:
        raise ValueError("No pose landmarks detected")

    # Extract key landmarks (normalized coordinates)
    left_shoulder = landmarks.landmark[mp_pose.PoseLandmark.LEFT_SHOULDER]
    right_shoulder = landmarks.landmark[mp_pose.PoseLandmark.RIGHT_SHOULDER]
    left_hip = landmarks.landmark[mp_pose.PoseLandmark.LEFT_HIP]
    right_hip = landmarks.landmark[mp_pose.PoseLandmark.RIGHT_HIP]
    left_elbow = landmarks.landmark[mp_pose.PoseLandmark.LEFT_ELBOW]
    left_wrist = landmarks.landmark[mp_pose.PoseLandmark.LEFT_WRIST]

    # Mock calculations (replace with real anthropometric models)
    shoulder_width = abs(left_shoulder.x - right_shoulder.x) * 1000  # Scale to cm
    hip_width = abs(left_hip.x - right_hip.x) * 1000
    arm_length = abs(left_elbow.y - left_wrist.y) * 1000

    # Mock body fat and muscle mass (replace with ML model or formula)
    body_fat = 20.0  # Placeholder
    muscle_mass = 40.0  # Placeholder

    return {
        "height": 175,  # Placeholder (requires height calibration)
        "weight": 75,  # Placeholder (requires user input or model)
        "bodyFat": body_fat,
        "muscleMass": muscle_mass,
        "chest": shoulder_width * 0.5,  # Mock scaling
        "waist": hip_width * 0.8,
        "hips": hip_width,
        "thighs": hip_width * 0.6,
        "arms": arm_length * 0.3,
        "createdAt": np.datetime64("now").astype(str),
    }

def generate_ai_feedback(landmarks: Any) -> Dict[str, Any]:
    """Generate AI feedback based on pose landmarks."""
    if not landmarks:
        raise ValueError("No pose landmarks detected")

    # Generate AI feedback based on pose landmarks
    left_shoulder = landmarks.landmark[mp_pose.PoseLandmark.LEFT_SHOULDER]
    right_shoulder = landmarks.landmark[mp_pose.PoseLandmark.RIGHT_SHOULDER]
    left_hip = landmarks.landmark[mp_pose.PoseLandmark.LEFT_HIP]  # 添加缺失的left_hip定义
    right_hip = landmarks.landmark[mp_pose.PoseLandmark.RIGHT_HIP]
    symmetry_score = 85 if abs(left_shoulder.y - right_shoulder.y) < 0.05 else 70

    # Mock posture grade (based on shoulder/hip alignment)
    posture_grade = 80 if abs(left_shoulder.x - left_hip.x) < 0.1 else 65  # 使用已定义的left_hip

    return {
        "bodyType": "Athletic",  # Placeholder (use ML classification)
        "strengths": ["Balanced shoulders", "Good posture"],
        "improvements": ["Increase core strength", "Improve arm symmetry"],
        "recommendations": ["Incorporate deadlifts", "Add yoga for flexibility"],
        "overallAssessment": "Good overall physique with room for core and arm improvements.",
        "areasToImprove": ["Core", "Arms"],
        "poseAnalysis": {
            "currentPose": "Standing",
            "angles": {"shoulder_hip_angle": 10.0},  # Mock angle
            "confidence": landmarks.landmark[0].visibility,
            "score": symmetry_score,
        },
        "symmetryScore": symmetry_score,
        "postureGrade": posture_grade,
        "createdAt": np.datetime64("now").astype(str),
    }

@api.route("/analyze-image", methods=["POST"])
def analyze_image() -> Tuple[Dict[str, Any], int]:
    """Analyze image and return body metrics and AI feedback."""
    try:
        # Validate request
        if not request.is_json:
            logging.error("Request must be JSON")
            return jsonify({"error": "Request must be JSON"}), 400

        data = request.get_json()
        image_url = data.get("imageUrl")
        user_id = data.get("userId")
        auth_token = request.headers.get("Authorization")

        if not image_url or not user_id:
            logging.error("Missing imageUrl or userId")
            return jsonify({"error": "Missing imageUrl or userId"}), 400

        # Verify user authentication with Supabase
        if not auth_token or not auth_token.startswith("Bearer "):
            logging.error("Invalid or missing Authorization header")
            return jsonify({"error": "Invalid or missing Authorization header"}), 401

        try:
            response = supabase.auth.get_user(auth_token.replace("Bearer ", ""))
            if response.user.id != user_id:
                logging.error("User ID mismatch")
                return jsonify({"error": "Unauthorized user"}), 401
        except Exception as e:
            logging.error(f"Authentication failed: {str(e)}")
            return jsonify({"error": "Authentication failed"}), 401

        # Fetch image from Supabase storage URL
        try:
            image_response = requests.get(image_url, timeout=10)
            if image_response.status_code != 200:
                raise ValueError("Failed to fetch image from URL")
            image = Image.open(io.BytesIO(image_response.content)).convert("RGB")
            validate_image(image)
        except Exception as e:
            logging.error(f"Error fetching image: {str(e)}")
            return jsonify({"error": f"Failed to fetch image: {str(e)}"}), 400

        # Process image with MediaPipe
        try:
            image_np = np.array(image)
            results = pose.process(image_np)
            if not results.pose_landmarks:
                logging.error("No pose landmarks detected in image")
                return jsonify({"error": "No person detected in image"}), 400

            metrics = calculate_body_metrics(results.pose_landmarks)
            feedback = generate_ai_feedback(results.pose_landmarks)
        except Exception as e:
            logging.exception("Error processing image with MediaPipe")
            return jsonify({"error": f"Failed to process image: {str(e)}"}), 500

        # Save to Supabase
        try:
            supabase.from_("physique_metrics").upsert({"user_id": user_id, **metrics}).execute()
            supabase.from_("ai_feedback").upsert({"user_id": user_id, **feedback}).execute()
        except Exception as e:
            logging.error(f"Error saving to Supabase: {str(e)}")
            return jsonify({"error": f"Failed to save data: {str(e)}"}), 500

        logging.info(f"Successfully analyzed image for user {user_id}")
        return jsonify({"metrics": metrics, "feedback": feedback}), 200

    except Exception as e:
        logging.exception(f"Unexpected error in analyze_image: {str(e)}")
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500

app.register_blueprint(api, url_prefix="/api")

if __name__ == "__main__":
    app.run(
        debug=os.getenv("FLASK_DEBUG", "True") == "True",
        host=os.getenv("FLASK_HOST", "0.0.0.0"),
        port=int(os.getenv("FLASK_PORT", "5000")),
    )