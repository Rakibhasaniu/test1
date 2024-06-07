"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const notFoundRoute_1 = __importDefault(require("./app/middlewares/notFoundRoute"));
const routes_1 = __importDefault(require("./app/routes"));
const app = (0, express_1.default)();
const corsOptions = {
    origin: ['http://localhost:3000', 'https://flatrent.vercel.app'],
    methods: ['GET', 'POST', "PUT", "PATCH", "DELETE"],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/api", (req, res) => {
    res.send("Hello Flat Finder Server");
});
app.use("/api", routes_1.default);
// Not found route
app.use("*", notFoundRoute_1.default);
// Global error handler
app.use(globalErrorHandler_1.default);
exports.default = app;
