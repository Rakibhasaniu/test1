"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const errorGenerator_1 = __importDefault(require("../errors/errorGenerator/errorGenerator"));
const globalErrorHandler = (err, req, res, next) => {
    let errorRes = {
        statusCode: http_status_1.default.INTERNAL_SERVER_ERROR,
        message: "" || "An Error Occurred",
        errorDetails: "",
    };
    errorRes = (0, errorGenerator_1.default)(err);
    res.status(errorRes.statusCode).json({
        success: false,
        message: errorRes.message || err.message,
        errorDetails: errorRes.errorDetails,
    });
};
exports.default = globalErrorHandler;
