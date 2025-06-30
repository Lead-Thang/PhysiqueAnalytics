"""
This module sets up a Flask application for analyzing body images using Mediapipe.
It provides an endpoint to upload an image and returns body metrics such as body fat percentage
and muscle group scores.
"""

from flask import Flask, request, jsonify, Blueprint
from flask_cors import CORS
import mediapipe as mp
from mediapipe import solutions
import numpy as np
from PIL import Image
import io
import logging
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": os.getenv("CORS_ORIGINS", "*")}})  # Adjust origins as needed

logging.basicConfig(level=os.getenv("LOG_LEVEL", "INFO"))

mp_pose = solutions.pose

# Create a Blueprint for better organization
api = Blueprint('api', __name__)

@api.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'}), 200

def extract_body_metrics(results):
    # TODO: Implement real metric extraction logic
    return {
        'body_fat_percentage': 20,  # Placeholder
        'muscle_group_scores': {'chest': 80, 'arms': 75}  # Placeholder
    }

@api.route('/analyze', methods=['POST'])
def analyze_image():
    if 'image' not in request.files:
        logging.error('No image part in the request')
        return jsonify({'error': 'No image part in the request'}), 400
    file = request.files['image']
    if file.filename == '':
        logging.error('No selected file')
        return jsonify({'error': 'No selected file'}), 400
    try:
        image = Image.open(file.stream).convert('RGB')
        image_np = np.array(image)
        with mp_pose.Pose(static_image_mode=True, min_detection_confidence=0.5) as pose:
            results = pose.process(image_np)
            body_metrics = extract_body_metrics(results)
        return jsonify(body_metrics)
    except Exception as e:
        logging.exception('Error processing image')
        return jsonify({'error': str(e)}), 500

app.register_blueprint(api, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=os.getenv("FLASK_DEBUG", "True") == "True")