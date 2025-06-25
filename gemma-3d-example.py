"""
Gemma 3D Example
This script demonstrates how to use the Gemma 3D Integration to create 3D models from natural language descriptions.
"""

import os
import sys
# Add the current directory to Python path to help with module imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
# Import the Gemma 3D integration module
from gemma_3d_integration import Gemma3DIntegration

# Create a directory for generated models if it doesn't exist
os.makedirs("generated_models", exist_ok=True)

# Initialize the Gemma 3D integration
gemma_3d = Gemma3DIntegration()

# Example natural language command for 3D modeling
cmd = "Create a blue cube with side length 2 units, centered at the origin. Add a red sphere of radius 1 unit above it at position (0, 1.5, 0)."

# Process the command and generate 3D modeling code
print("Generating 3D modeling code based on command: ", cmd)
print("This may take a few moments...")

try:
    generated_code = gemma_3d.process_3d_command(cmd)
    
    # Save the generated code to a file in the models directory
    example_path = os.path.join("generated_models", "example_model.py")
    with open(example_path, "w") as f:
        f.write(generated_code)
    
    print(f"\n3D modeling code generated successfully! Code saved to {example_path}")
    print("\nGenerated code:")
    print("=" * 50)
    print(generated_code)
    print("=" * 50)
    
    print("\nExecuting the generated code to create the 3D model...")
    result = gemma_3d.execute_3d_code(example_path)
    
    if result["success"]:
        print("\n3D model created successfully!")
        print("Output:")
        print(result["output"])
    else:
        print("\nError creating 3D model:")
        print(result["error"])
        
    # Analyze the generated model
    analysis_prompt = "A 3D model consisting of a blue cube with side length 2 units centered at the origin and a red sphere of radius 1 unit at position (0, 1.5, 0)."
    print("\nAnalyzing the 3D model structure...")
    analysis = gemma_3d.analyze_3d_model(analysis_prompt)
    print("\nModel Analysis:")
    print(analysis)
    
except Exception as e:
    print(f"\nAn error occurred: {str(e)}")

print("\nExample execution completed.")