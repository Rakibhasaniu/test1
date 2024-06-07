import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import validationRequest from "../../middlewares/validationRequest";
import { FlatShareControllers } from "./flatShare.controllers";
import { FlatShareRequestValidations } from "./flatShare.validations";

const router = express.Router();

// Post a flat
router.post(
  "/flat-share-request",
  auth(UserRole.USER, UserRole.ADMIN),
  validationRequest(FlatShareRequestValidations.createFlatShareRequest),
  FlatShareControllers.flatShareRequest
);

// Get all users flat share requests
router.get(
  "/flat-share-requests",
  auth(UserRole.ADMIN),
  FlatShareControllers.getAllFlatShareRequests
);

// My requests on others flats to share
router.get(
  "/my-flat-requests",
  auth(UserRole.ADMIN, UserRole.USER),
  FlatShareControllers.getMyFlatShareRequests
);

// Other users requests on my flats
router.get(
  "/requests-on-my-flat",
  auth(UserRole.ADMIN, UserRole.USER),
  FlatShareControllers.getAllRequestsOnMyFlatPost
);

// Update Flat share request for admin and user
router.patch(
  "/flat-share-request/:flatShareId",
  auth(UserRole.ADMIN, UserRole.USER),
  validationRequest(FlatShareRequestValidations.updateFlatShareRequest),
  FlatShareControllers.updateFlatShareRequest
);

// Delete Flat share request for user and admin
router.delete(
  "/flat-share-request/:flatShareId",
  auth(UserRole.USER, UserRole.ADMIN),
  FlatShareControllers.deleteFlatShareRequest
);

export const FlatShareRoutes = router;
