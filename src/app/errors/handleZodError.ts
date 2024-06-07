import httpStatus from "http-status";
import { TErrorResponse } from "../interfaces/TErrorResponse";

const handleZodError = (err: any): TErrorResponse => {
  let errorMessage: string = "";
  const errorDetails: any[] = [];

  if (err.issues.length > 0) {
    err.issues.forEach((issue: any) => {
      errorMessage += issue.message + ". ";
    });
    err.issues.map((issue: any) => {
      errorDetails.push({
        field: issue.path[1],
        message: issue.message,
      });
    });
  }

  return {
    statusCode: httpStatus.BAD_REQUEST,
    message: errorMessage,
    errorDetails: { issues: errorDetails },
  };
};

export default handleZodError;
