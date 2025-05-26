import { Expose, Transform } from "class-transformer";
import { IsIn, IsInt, IsOptional, Min } from "class-validator";

const allowedFormats = ["jpeg", "png", "webp"];

export class ImageTransformDto {
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === "string" ? value.toLowerCase() : undefined
  )
  @IsIn(allowedFormats, {
    message: `Format must be one of: ${allowedFormats.join(", ")}`,
  })
  @Expose()
  format?: string;

  @IsOptional()
  @Transform(({ value }) =>
    value && Number(value) > 0 ? Number(value) : undefined
  )
  @IsInt()
  @Min(1, { message: "Width must be at least 1" })
  @Expose()
  width?: number;

  @IsOptional()
  @Transform(({ value }) =>
    value && Number(value) > 0 ? Number(value) : undefined
  )
  @IsInt()
  @Min(1, { message: "Height must be at least 1" })
  @Expose()
  height?: number;
}
