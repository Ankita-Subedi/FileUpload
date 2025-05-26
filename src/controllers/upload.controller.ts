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
  if (!req.file?.buffer) {
    throw new ApiError("No file uploaded", 400);
  }

  const { format, width, height } = req.validated.body;

  if (!format && !width && !height) {
    throw new ApiError(
      "Please specify at least one option: format, width, or height to convert the image.",
      400
    );
  }
  const result = await processImage(req.file.buffer, req.file.originalname, {
    format: format as ValidFormat,
    width,
    height,
  });

  res.set("Content-Type", `image/${result.format}`);
  res.status(200).send(result.buffer);
};
