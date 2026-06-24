import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rateLimit";
import { getCloudinaryFolder, uploadBufferToCloudinary } from "@/lib/cloudinary";

export async function POST(request: Request) {
  const limited = rateLimit(request, { key: "upload:post", max: 5, windowMs: 60_000 })
  if (limited.blocked && limited.response) return limited.response

  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const upload = await uploadBufferToCloudinary(buffer, {
      fileName: file.name,
      folder: getCloudinaryFolder("uploads"),
      resourceType: "auto",
    });

    return NextResponse.json({
      url: upload.secure_url,
      secure_url: upload.secure_url,
      public_id: upload.public_id,
      resource_type: upload.resource_type,
      width: upload.width,
      height: upload.height,
      format: upload.format,
      bytes: upload.bytes,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}
