import { z } from "zod";

const createFlatShareRequest = z.object({
  body: z.object({
    flatId: z.string({
      required_error: "FlatId field is required",
      invalid_type_error: "FlatId must be a string",
    }),
    message: z
      .string({
        required_error: "Message field is required",
        invalid_type_error: "Message must be a string",
      })
      .optional(),
    space: z
      .number({
        required_error: "Space field is required",
        invalid_type_error: "Space must be a string",
      })
      .optional(),
  }),
});

const updateFlatShareRequest = z.object({
  body: z.object({
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
    flatId: z.string({
      required_error: "FlatId field is required",
      invalid_type_error: "FlatId must be a string",
    }),
  }),
});

export const FlatShareRequestValidations = {
  createFlatShareRequest,
  updateFlatShareRequest,
};
