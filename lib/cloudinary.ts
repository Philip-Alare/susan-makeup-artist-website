import { v2 as cloudinary } from "cloudinary";

let isConfigured = false;

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured`);
  }
  return value;
}

export function getCloudinary() {
  if (!isConfigured) {
    cloudinary.config({
      cloud_name: requireEnv("CLOUDINARY_CLOUD_NAME"),
      api_key: requireEnv("CLOUDINARY_API_KEY"),
      api_secret: requireEnv("CLOUDINARY_API_SECRET"),
      secure: true,
    });
    isConfigured = true;
  }

  return cloudinary;
}

export function getCloudinaryFolder(subfolder = "uploads") {
  const base = process.env.CLOUDINARY_FOLDER || "beautyhomebysuzain";
  return `${base}/${subfolder}`.replace(/\/+/g, "/");
}

export async function uploadBufferToCloudinary(
  buffer: Buffer,
  options: {
    fileName: string;
    folder?: string;
    resourceType?: "image" | "video" | "raw" | "auto";
  },
) {
  const client = getCloudinary();
  const folder = options.folder || getCloudinaryFolder();
  const resourceType = options.resourceType || "auto";

  return new Promise<any>((resolve, reject) => {
    const stream = client.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        use_filename: true,
        unique_filename: true,
        overwrite: false,
        filename_override: options.fileName,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      },
    );

    stream.end(buffer);
  });
}
