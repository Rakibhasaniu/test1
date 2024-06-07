"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const jwtHelpers_1 = require("../../helper/jwtHelpers");
const config_1 = __importDefault(require("../../config"));
const auth = (...roles) => {
    return (req, res, next) => {
        const token = req.headers.authorization;
        if (!token) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized!");
        }
        const verifiedUser = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.JWT_SECRET);
        if (!verifiedUser) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized!");
        }
        req.user = verifiedUser;
        if (roles.length && !roles.includes(verifiedUser.role)) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Forbidden access!");
        }
        next();
    };
};
exports.default = auth;
