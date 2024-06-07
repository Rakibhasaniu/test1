import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import validationRequest from "../../middlewares/validationRequest";
import { FlatControllers } from "./flat.controllers";
import { FlatValidationsSchema } from "./flat.validations";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.USER),
  validationRequest(FlatValidationsSchema.createFlat),
  FlatControllers.addFlat
);

router.get("/", FlatControllers.getAllFlats);

router.get(
  "/my-flats",
  auth(UserRole.USER, UserRole.ADMIN),
  FlatControllers.getMyAllFlats
);

router.get("/:flatId", FlatControllers.getFlatById);

router.put(
  "/:flatId",
  auth(UserRole.ADMIN, UserRole.USER),
  validationRequest(FlatValidationsSchema.updateFlat),
  FlatControllers.updateFlat
);

router.delete(
  "/:flatId/photo",
  auth(UserRole.ADMIN, UserRole.USER),
  validationRequest(FlatValidationsSchema.deleteFlatImage),
  FlatControllers.deleteFlatImage
);

router.delete(
  "/:flatId",
  auth(UserRole.ADMIN, UserRole.USER),
  FlatControllers.deleteFlatPost
);

export const FlatRoutes = router;
