import { z } from "zod";

const CreateUser = z.object({
  body: z.object({
    username: z.string({
      required_error: "User Name field is required",
      invalid_type_error: "User Name must be a string",
    }),
    email: z
      .string({
        required_error: "Email field is required",
      })
      .email("Email must be a valid email address"),
    password: z
      .string({
        required_error: "Password field is required",
      })
      .min(5, "Password too short - should be 5 chars minimum"),
  }),
});

const loginData = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email field is required",
      })
      .email("Email must be a valid email address"),
    password: z.string({
      required_error: "Password field is required",
    }),
  }),
});

export const UserValidationsSchema = {
  CreateUser,
  loginData,
};
