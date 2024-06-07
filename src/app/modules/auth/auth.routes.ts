import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import validationRequest from "../../middlewares/validationRequest";
import { UserValidationsSchema } from "../User/user.validations";
import { AuthControllers } from "./auth.controller";

const router = express.Router();

router.post(
  "/login",
  validationRequest(UserValidationsSchema.loginData),
  AuthControllers.loginUser
);

router.post("/refresh-token", AuthControllers.refreshToken);

router.post(
  "/change-password",
  auth(UserRole.ADMIN, UserRole.USER),
  AuthControllers.changePassword
);

export const AuthRoutes = router;
