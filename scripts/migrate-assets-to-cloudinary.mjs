#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { v2 as cloudinary } from "cloudinary";

const rootDir = process.cwd();
const outputPath = path.join(rootDir, "data", "cloudinary-asset-map.json");
const tempDir = path.join(rootDir, ".tmp", "cloudinary-migration");
const cloudinaryLimitBytes = 10 * 1024 * 1024;
const ffmpegPath =
  process.env.FFMPEG_PATH ||
  path.join(
    process.env.LOCALAPPDATA || "",
    "Microsoft",
    "WinGet",
    "Packages",
    "Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe",
    "ffmpeg-8.1.1-full_build",
    "bin",
    "ffmpeg.exe",
  );
const sourceRoots = [
  path.join(rootDir, "public", "assets"),
  path.join(rootDir, "assets"),
];
const mediaExtensions = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".avif",
  ".svg",
  ".mp4",
  ".mov",
  ".m4v",
  ".webm",
]);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

function normalizeSlashes(value) {
  return value.replace(/\\/g, "/");
}

function removeExtension(value) {
  return value.replace(/\.[^.]+$/, "");
}

function sanitizePublicIdSegment(value) {
  return value.replace(/[^a-zA-Z0-9/_-]+/g, "-");
}

function getResourceType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if ([".mp4", ".mov", ".m4v", ".webm"].includes(ext)) return "video";
  if ([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".svg"].includes(ext)) return "image";
  return "raw";
}

function isSupportedMediaFile(filePath) {
  return mediaExtensions.has(path.extname(filePath).toLowerCase());
}

function uploadLarge(filePath, options) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_large(
      filePath,
      options,
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      },
    );
  });
}

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";

    child.stderr.on("data", (chunk) => {
      stderr += String(chunk);
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(stderr.trim() || `${command} exited with code ${code}`));
    });
  });
}

async function saveAssetMap(assetMap) {
  await fs.writeFile(outputPath, `${JSON.stringify(assetMap, null, 2)}\n`, "utf8");
}

async function compressVideoForUpload(filePath, relativeBaseName) {
  const attempts = [
    {
      suffix: "crf28",
      args: [
        "-y",
        "-i",
        filePath,
        "-map",
        "0:v:0",
        "-map",
        "0:a?",
        "-c:v",
        "libx264",
        "-preset",
        "medium",
        "-crf",
        "28",
        "-c:a",
        "aac",
        "-b:a",
        "96k",
        "-movflags",
        "+faststart",
      ],
    },
    {
      suffix: "crf30-1280",
      args: [
        "-y",
        "-i",
        filePath,
        "-map",
        "0:v:0",
        "-map",
        "0:a?",
        "-vf",
        "scale=1280:-2:force_original_aspect_ratio=decrease:flags=lanczos",
        "-c:v",
        "libx264",
        "-preset",
        "medium",
        "-crf",
        "30",
        "-c:a",
        "aac",
        "-b:a",
        "96k",
        "-movflags",
        "+faststart",
      ],
    },
    {
      suffix: "crf32-960",
      args: [
        "-y",
        "-i",
        filePath,
        "-map",
        "0:v:0",
        "-map",
        "0:a?",
        "-vf",
        "scale=960:-2:force_original_aspect_ratio=decrease:flags=lanczos",
        "-c:v",
        "libx264",
        "-preset",
        "medium",
        "-crf",
        "32",
        "-c:a",
        "aac",
        "-b:a",
        "80k",
        "-movflags",
        "+faststart",
      ],
    },
  ];

  for (const attempt of attempts) {
    const outputFile = path.join(tempDir, `${relativeBaseName}-${attempt.suffix}.mp4`);
    await fs.mkdir(path.dirname(outputFile), { recursive: true });
    await runCommand(ffmpegPath, [...attempt.args, outputFile]);
    const size = (await fs.stat(outputFile)).size;
    if (size <= cloudinaryLimitBytes) {
      return outputFile;
    }
  }

  throw new Error(`Unable to compress video under ${cloudinaryLimitBytes} bytes: ${filePath}`);
}

async function compressGifForUpload(filePath, relativeBaseName) {
  const attempts = [
    { suffix: "gif-720-12", fps: 12, width: 720, colors: 128 },
    { suffix: "gif-640-10", fps: 10, width: 640, colors: 96 },
    { suffix: "gif-480-8", fps: 8, width: 480, colors: 64 },
    { suffix: "gif-420-7", fps: 7, width: 420, colors: 48 },
    { suffix: "gif-320-6", fps: 6, width: 320, colors: 32 },
  ];

  for (const attempt of attempts) {
    const outputFile = path.join(tempDir, `${relativeBaseName}-${attempt.suffix}.gif`);
    await fs.mkdir(path.dirname(outputFile), { recursive: true });
    const filter = `fps=${attempt.fps},scale=${attempt.width}:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=${attempt.colors}[p];[s1][p]paletteuse=dither=sierra2_4a`;
    await runCommand(ffmpegPath, [
      "-y",
      "-i",
      filePath,
      "-filter_complex",
      filter,
      outputFile,
    ]);
    const size = (await fs.stat(outputFile)).size;
    if (size <= cloudinaryLimitBytes) {
      return outputFile;
    }
  }

  throw new Error(`Unable to compress gif under ${cloudinaryLimitBytes} bytes: ${filePath}`);
}

async function prepareFileForUpload(filePath, resourceType, relative) {
  const stat = await fs.stat(filePath);
  if (stat.size <= cloudinaryLimitBytes) {
    return filePath;
  }

  await fs.mkdir(tempDir, { recursive: true });
  const relativeBaseName = normalizeSlashes(relative).replace(/[^a-zA-Z0-9/_-]+/g, "-");

  if (resourceType === "video") {
    return compressVideoForUpload(filePath, relativeBaseName);
  }

  if (path.extname(filePath).toLowerCase() === ".gif") {
    return compressGifForUpload(filePath, relativeBaseName);
  }

  throw new Error(`No compression strategy for oversized file: ${filePath}`);
}

async function collectFiles(root, current = root) {
  const entries = await fs.readdir(current, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(current, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(root, fullPath)));
      continue;
    }
    files.push(fullPath);
  }

  return files;
}

async function main() {
  const missing = ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"].filter(
    (key) => !process.env[key],
  );
  if (missing.length > 0) {
    throw new Error(`Missing Cloudinary env vars: ${missing.join(", ")}`);
  }

  const existing = await fs
    .readFile(outputPath, "utf8")
    .then((value) => JSON.parse(value))
    .catch(() => ({}));

  const assetMap = { ...existing };
  let uploaded = 0;
  let skipped = 0;

  for (const root of sourceRoots) {
    try {
      await fs.access(root);
    } catch {
      continue;
    }

    const files = await collectFiles(root);
    for (const filePath of files) {
      if (!isSupportedMediaFile(filePath)) {
        skipped += 1;
        continue;
      }

      const relative = normalizeSlashes(path.relative(root, filePath));
      const assetKey = `/assets/${relative}`;

      if (assetMap[assetKey]) {
        skipped += 1;
        continue;
      }

      const publicId = sanitizePublicIdSegment(
        `${process.env.CLOUDINARY_FOLDER || "beautyhomebysuzain"}/assets/${removeExtension(relative)}`,
      );
      const resourceType = getResourceType(filePath);
      const uploadPath = await prepareFileForUpload(filePath, resourceType, relative);
      const fileSize = (await fs.stat(uploadPath)).size;
      const result =
        fileSize > 9 * 1024 * 1024
          ? await uploadLarge(uploadPath, {
              public_id: publicId,
              overwrite: true,
              unique_filename: false,
              use_filename: false,
              resource_type: resourceType,
              chunk_size: 6_000_000,
            })
          : await cloudinary.uploader.upload(uploadPath, {
              public_id: publicId,
              overwrite: true,
              unique_filename: false,
              use_filename: false,
              resource_type: resourceType,
            });

      assetMap[assetKey] = result.secure_url;
      await saveAssetMap(assetMap);
      uploaded += 1;
      console.log(`Uploaded ${assetKey} -> ${result.secure_url}`);
    }
  }

  await saveAssetMap(assetMap);

  console.log(`Cloudinary migration complete. Uploaded: ${uploaded}. Skipped existing: ${skipped}.`);
  console.log(`Asset map written to ${outputPath}`);
}

main().catch((error) => {
  console.error("Asset migration failed:", error);
  process.exitCode = 1;
});
