"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = require("../modules/User/user.routes");
const flat_routes_1 = require("../modules/Flat/flat.routes");
const auth_routes_1 = require("../modules/Auth/auth.routes");
const flatShare_routes_1 = require("../modules/FlatShare/flatShare.routes");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/",
        route: user_routes_1.UserRoutes,
    },
    {
        path: "/auth",
        route: auth_routes_1.AuthRoutes,
    },
    {
        path: "/flats",
        route: flat_routes_1.FlatRoutes,
    },
    {
        path: "/",
        route: flatShare_routes_1.FlatShareRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
