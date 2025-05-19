import { Expose, Transform } from "class-transformer";
import { IsIn, IsInt, IsOptional, Min } from "class-validator";

const allowedFormats = ["jpeg", "png", "webp"];

export class ImageTransformDto {
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value !== "string") return undefined;
    const lower = value.toLowerCase();
    return lower === "jpg" ? "jpeg" : lower;
  })
  @IsIn(allowedFormats, {
    message: `Format must be one of: ${allowedFormats.join(", ")}`,
  })
  @Expose()
  format?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === "") return undefined;
    return parseInt(value, 10);
  })
  @IsInt({ message: "Width must be an integer" })
  @Min(1, { message: "Width must be at least 1" })
  @Expose()
  width?: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === "") return undefined;
    return parseInt(value, 10);
  })
  @IsInt({ message: "Height must be an integer" })
  @Min(1, { message: "Height must be at least 1" })
  @Expose()
  height?: number;
}
