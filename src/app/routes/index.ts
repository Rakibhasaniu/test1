import express from "express";
import { UserRoutes } from "../modules/User/user.routes";
import { FlatRoutes } from "../modules/Flat/flat.routes";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { FlatShareRoutes } from "../modules/FlatShare/flatShare.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/flats",
    route: FlatRoutes,
  },
  {
    path: "/",
    route: FlatShareRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
