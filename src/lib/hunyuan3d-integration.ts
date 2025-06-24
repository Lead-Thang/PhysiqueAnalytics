// hunyuan3d-integration.ts

import { spawn } from 'child_process';
import path from 'path';

// Function to generate a 3D shape from an input image
export async function generate3DShape(imagePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const python = spawn('python', [
      path.join(__dirname, '../../Hunyuan3D-2/hy3dgen/shapegen/run_shape_gen.py'), // Adjust this path if needed
      '--image_path', imagePath
    ]);

    let output = '';
    let errorOutput = '';

    python.stdout.on('data', (data) => {
      output += data.toString();
    });

    python.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    python.on('close', (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error(`Failed to generate shape. Code: ${code}, stderr: ${errorOutput}`));
      }
    });
  });
}

// Function to apply textures to a 3D mesh
export async function applyTextureToMesh(meshPath: string, imagePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const python = spawn('python', [
      path.join(__dirname, '../../Hunyuan3D-2/hy3dgen/texgen/run_tex_gen.py'), // Adjust this path if needed
      '--mesh_path', meshPath,
      '--image_path', imagePath
    ]);

    let output = '';
    let errorOutput = '';

    python.stdout.on('data', (data) => {
      output += data.toString();
    });

    python.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    python.on('close', (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error(`Failed to apply texture. Code: ${code}, stderr: ${errorOutput}`));
      }
    });
  });
}