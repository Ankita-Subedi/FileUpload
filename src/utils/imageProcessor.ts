import sharp from "sharp";
import path from "path";
import fs from "fs/promises";

export const validFormats = ["jpeg", "jpg", "png", "webp"] as const;
export type ValidFormat = (typeof validFormats)[number];

const PROCESSED_DIR = path.resolve(process.cwd(), "processed");

interface ProcessOptions {
  width?: number;
  height?: number;
  format?: ValidFormat;
}

const normalizeFormat = (format: string): ValidFormat => {
  if (format === "jpg") return "jpeg";
  return format as ValidFormat;
};

export async function processImage(
  buffer: Buffer,
  originalName: string,
  options: ProcessOptions
): Promise<{
  format: string;
  buffer: Buffer;
  message: string;
  filePath: string;
}> {
  const metadata = await sharp(buffer).metadata();
  let processedImage = sharp(buffer);

  if (options.width || options.height) {
    processedImage = processedImage.resize({
      width: options.width ?? metadata.width,
      height: options.height ?? metadata.height,
    });
  }

  const finalFormat: ValidFormat = normalizeFormat(
    options.format ?? metadata.format ?? "jpeg"
  );
  processedImage = processedImage.toFormat(finalFormat);

  const processedBuffer = await processedImage.toBuffer();

  await fs.mkdir(PROCESSED_DIR, { recursive: true });

  const baseName = path.parse(originalName).name.replace(/\s+/g, "-");
  const filename = `${baseName}-${Date.now()}.${finalFormat}`;
  const outputPath = path.join(PROCESSED_DIR, filename);
  await sharp(processedBuffer).toFile(outputPath);

  return {
    format: finalFormat,
    buffer: processedBuffer,
    message: "Image processed successfully",
    filePath: outputPath,
  };
}
