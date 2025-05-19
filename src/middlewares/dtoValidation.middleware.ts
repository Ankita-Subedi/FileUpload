import { NextFunction, Request, RequestHandler, Response } from "express";
import { sanitize } from "class-sanitizer";
import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { ApiError } from "../error/ApiError";

export enum DTOSource {
  BODY = "body",
  QUERY = "query",
  PARAMS = "params",
}

export type ValidatedRequest<P = any, Q = any, B = any> = Request & {
  validated: {
    query: Q;
    body: B;
    params: P;
  };
};

function resolveError(errors: ValidationError[]) {
  const tmp: string[] = [];

  for (const error of errors) {
    if (error.children && error.children?.length > 0) {
      const constraints: string[] = resolveError(error.children);
      tmp.push(...constraints);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (error.constraints) tmp.push((Object as any).values(error.constraints));
  }

  return tmp;
}

export function validateDto(
  type: any,
  source: DTOSource,
  whitelist = true,
  skipMissingProperties = false
): RequestHandler {
  return (req: any, _res: Response, next: NextFunction) => {
    req.validated = req.validated ?? { query: {}, body: {}, params: {} };

    const dtoSrc = req[source];
    if (!dtoSrc) {
      return next();
    }

    // ✅ Fix for form-data: convert numeric strings in req.body to numbers
    if (
      source === DTOSource.BODY &&
      req.headers["content-type"]?.includes("multipart/form-data")
    ) {
      for (const key in dtoSrc) {
        const val = dtoSrc[key];
        if (!isNaN(val)) {
          dtoSrc[key] = Number(val);
        }
      }
    }

    const dtoObj = plainToInstance(type, dtoSrc, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });

    validate(dtoObj, { whitelist, skipMissingProperties }).then(
      (errors: Array<ValidationError>) => {
        if (errors.length > 0) {
          const constraints = resolveError(errors);
          const dtoErrors = constraints.join(", ");
          next(new ApiError(dtoErrors, 400));
        } else {
          sanitize(dtoObj);

          req.validated[source] = {
            ...req.validated[source],
            ...dtoObj,
          };

          next();
        }
      }
    );
  };
}
