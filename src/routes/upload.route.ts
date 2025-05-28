import { RequestHandler, Router } from "express";
import upload from "../config/multer.config";
import { uploadImageHandler } from "../controllers/upload.controller";
import {
  DTOSource,
  validateDto,
} from "../middlewares/dtoValidation.middleware";
import { ImageTransformDto } from "../dto/imageTransformDto";

const router = Router();

// Middleware to handle multer errors gracefully
const handleMulterUpload: RequestHandler = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(400).json({
        success: false,
        message: "Multer error: " + err.message,
      });
    }
    next();
  });
};

router.post(
  "/upload",
  handleMulterUpload,
  validateDto(ImageTransformDto, DTOSource.BODY),
  uploadImageHandler as unknown as RequestHandler
);

export default router;
