#!/usr/bin/env node

import { v2 as cloudinary } from "cloudinary";

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "YOUR_CLOUD_NAME";
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || "YOUR_API_KEY";
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || "YOUR_API_SECRET";

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

async function main() {
  const sampleUrl = "https://res.cloudinary.com/demo/image/upload/sample.jpg";

  const upload = await cloudinary.uploader.upload(sampleUrl, {
    folder: "beautyhomebysuzain/onboarding",
    public_id: "sample-image",
    overwrite: true,
    resource_type: "image",
  });

  console.log(`Uploaded secure URL: ${upload.secure_url}`);
  console.log(`Uploaded public ID: ${upload.public_id}`);

  const details = await cloudinary.api.resource(upload.public_id, {
    resource_type: upload.resource_type || "image",
  });

  console.log(`Width: ${details.width}`);
  console.log(`Height: ${details.height}`);
  console.log(`Format: ${details.format}`);
  console.log(`File size (bytes): ${details.bytes}`);

  const transformedUrl = cloudinary.url(upload.public_id, {
    secure: true,
    resource_type: upload.resource_type || "image",
    fetch_format: "auto", // f_auto serves the best output format supported by the browser.
    quality: "auto", // q_auto lets Cloudinary choose an efficient quality setting automatically.
  });

  console.log("Done! Click link below to see optimized version of the image. Check the size and the format.");
  console.log(transformedUrl);
}

main().catch((error) => {
  console.error("Cloudinary onboarding failed:", error);
  process.exitCode = 1;
});
