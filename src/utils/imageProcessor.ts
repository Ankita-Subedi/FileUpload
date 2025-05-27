import sharp from "sharp";

export const validFormats = ["jpeg", "jpg", "png", "webp"] as const;
export type ValidFormat = (typeof validFormats)[number];

interface ProcessOptions {
  width?: number;
  height?: number;
  format?: ValidFormat;
}

export async function processImage(
  buffer: Buffer,
  _originalName: string,
  options: ProcessOptions
): Promise<{
  format: string;
  buffer: Buffer;
  message: string;
}> {
  let image = sharp(buffer);

  if (options.width || options.height) {
    image = image.resize({
      width: options.width,
      height: options.height,
    });
  }

  const format = (options.format ?? "jpeg") as ValidFormat;
  image = image.toFormat(format);

  const processedBuffer = await image.toBuffer();

  return {
    format,
    buffer: processedBuffer,
    message: "Image processed successfully",
  };
}
