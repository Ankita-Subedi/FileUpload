import { IsDefined, IsEnum, IsNumber, validateSync } from "class-validator";
import dotenv from "dotenv";
import { Expose, Transform, plainToInstance } from "class-transformer";

dotenv.config();

export enum NodeEnv {
  Development = "development",
  Production = "production",
}
export class EnvSchema {
  @Expose()
  @IsNumber()
  @IsDefined()
  @Transform(({ value }) => Number(value))
  public readonly PORT!: number;

  @Expose()
  @IsEnum(NodeEnv)
  @Transform(({ value }) => (value ? value : NodeEnv.Production))
  public readonly NODE_ENV!: NodeEnv;
}

export let config: EnvSchema;

function validateEnvSchema() {
  config = plainToInstance(EnvSchema, process.env, {
    excludeExtraneousValues: true,
  });

  const error = validateSync(config, {
    whitelist: true,
  });

  if (error.length > 0) throw new Error(JSON.stringify(error));
}

validateEnvSchema();
