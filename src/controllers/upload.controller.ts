import { Response } from "express";
import { ApiError } from "../error/ApiError";
import {
  processImage,
  ValidFormat,
  validFormats,
} from "../utils/imageProcessor";
import { ValidatedRequest } from "../middlewares/dtoValidation.middleware";
import { ImageTransformDto } from "../dto/imageTransformDto";

export const uploadImageHandler = async (
  req: ValidatedRequest<any, any, ImageTransformDto>,
  res: Response
) => {
  console.log("file:", req.file);
  if (!req.file?.buffer) throw new ApiError("No file uploaded", 400);
  const { format, width, height } = req.validated.body;
  console.log("Raw body:", req.body);
  console.log("Validated body:", req.validated?.body);

  const result = await processImage(req.file.buffer, req.file.originalname, {
    format: validFormats.includes(format as ValidFormat)
      ? (format as ValidFormat)
      : undefined,
    width,
    height,
  });

  res.status(200).json({
    success: true,
    message: result.message,
    file: result.filePath,
  });
};
