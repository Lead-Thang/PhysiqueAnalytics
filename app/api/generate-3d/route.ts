// app/api/generate-3d/route.ts

import { NextRequest } from "next/server";
import { generate3DShape, applyTextureToMesh } from "src/lib/hunyuan3d-integration";

export async function POST(req: NextRequest) {
  try {
    const { imagePath } = await req.json();

    if (!imagePath) {
      return new Response(
        JSON.stringify({ error: "Image path is required." }),
        { status: 400 }
      );
    }

    // Step 1: Generate 3D shape from image
    const meshUntextured = await generate3DShape(imagePath);

    // Step 2: Apply texture to the generated mesh
    const meshTextured = await applyTextureToMesh(meshUntextured, imagePath);

    return new Response(JSON.stringify({ mesh: meshTextured }), { status: 200 });
  } catch (error) {
    console.error("Error generating 3D asset:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate 3D asset." }),
      { status: 500 }
    );
  }
}