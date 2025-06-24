// test-hunyuan-integration.ts

import { generate3DShape, applyTextureToMesh } from 'src/lib/hunyuan3d-integration';

// Utility to extract readable error message
function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  return 'Unknown error';
}

async function testIntegration() {
  const imagePath = 'assets/demo.png'; // Make sure this image exists
  const meshPath = 'output/mesh.obj'; // Example output path

  try {
    console.log('🔄 Generating 3D shape...');
    const meshUntextured = await generate3DShape(imagePath);
    console.log('✅ Shape generated:', meshUntextured);

    console.log('🎨 Applying texture to mesh...');
    const meshTextured = await applyTextureToMesh(meshPath, imagePath);
    console.log('✅ Texture applied:', meshTextured);
  } catch (error) {
    console.error('❌ Error during integration:', getErrorMessage(error));
  }
}

testIntegration();