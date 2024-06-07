import { ErrorRequestHandler } from "express";
import httpStatus from "http-status";
import { TErrorResponse } from "../interfaces/TErrorResponse";
import errorGenerator from "../errors/errorGenerator/errorGenerator";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next): void => {
  let errorRes: TErrorResponse = {
    statusCode: httpStatus.INTERNAL_SERVER_ERROR,
    message: "" || "An Error Occurred",
    errorDetails: "",
  };

  errorRes = errorGenerator(err);

  res.status(errorRes.statusCode).json({
    success: false,
    message: errorRes.message || err.message,
    errorDetails: errorRes.errorDetails,
  });
};

export default globalErrorHandler;
