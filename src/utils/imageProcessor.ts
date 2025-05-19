import sharp from "sharp";
import path from "path";
import fs from "fs/promises";

export const validFormats = ["jpeg", "png", "webp"] as const;
export type ValidFormat = (typeof validFormats)[number];

interface ProcessOptions {
  width?: number;
  height?: number;
  format?: ValidFormat;
}

export async function processImage(
  buffer: Buffer,
  originalName: string,
  options: ProcessOptions
): Promise<{ message: string; filePath?: string }> {
  const metadata = await sharp(buffer).metadata();
  let processedImage = sharp(buffer);
  const changes: string[] = [];

  // Resize if needed
  let resizeNeeded = false;
  if (options.width || options.height) {
    // Use original if dimension not provided
    const targetWidth = options.width ?? metadata.width;
    const targetHeight = options.height ?? metadata.height;

    if (metadata.width === targetWidth && metadata.height === targetHeight) {
      changes.push("image already in requested size");
    } else {
      processedImage = processedImage.resize(targetWidth, targetHeight);
      changes.push(`resized to ${targetWidth}x${targetHeight}`);
      resizeNeeded = true;
    }
  }

  // Convert format if needed
  if (options.format && options.format !== metadata.format) {
    processedImage = processedImage.toFormat(options.format);
    changes.push(`converted to ${options.format}`);
  } else if (options.format === metadata.format) {
    changes.push(`image already in ${options.format} format`);
  }

  const didConvert = changes.some((msg) => msg.startsWith("converted"));

  if (!resizeNeeded && !didConvert) {
    return {
      message: `Image processed: ${changes.join(", ")}, no file saved`,
    };
  }

  const ext = options.format || metadata.format || "jpeg";
  const filename = `${Date.now()}-processed.${ext}`;
  const outputPath = path.join(__dirname, "../processed", filename);

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await processedImage.toFile(outputPath);

  return {
    message: `Image processed: ${changes.join(", ")}`,
    filePath: outputPath,
  };
}
