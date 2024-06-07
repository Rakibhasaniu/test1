import { ZodError } from "zod";
import { TErrorResponse } from "../../interfaces/TErrorResponse";
import handleZodError from "../handleZodError";
import httpStatus from "http-status";

const errorGenerator = (err: any): TErrorResponse => {
  if (err instanceof ZodError) {
    return handleZodError(err);
  } else {
    return {
      statusCode: err.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
      message: err.message,
      errorDetails: err,
    };
  }
};

export default errorGenerator;
