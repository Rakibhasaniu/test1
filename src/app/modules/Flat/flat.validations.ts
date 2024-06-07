import { z } from "zod";

const createFlat = z.object({
  body: z.object({
    bedrooms: z.number({
      required_error: "Bedrooms field is required",
      invalid_type_error: "Bedrooms must be a number",
    }),
    location: z.string({
      required_error: "Location field is required",
      invalid_type_error: "Location must be a string",
    }),
    description: z.string({
      required_error: "Description field is required",
      invalid_type_error: "Description must be a string",
    }),
    rentAmount: z.number({
      required_error: "Rent field is required",
      invalid_type_error: "Rent must be a number",
    }),
    amenities: z
      .array(
        z.string({
          required_error: "amenities field is required",
          invalid_type_error: "amenities must be a string",
        })
      )
      .optional(),
    photos: z
      .array(z.string().url("Each photo must be a valid URL"))
      .nonempty("At least one photo is required"),
  }),
});

const updateFlat = z.object({
  body: z.object({
    bedrooms: z
      .number({
        required_error: "Total bedrooms field is required",
        invalid_type_error: "Total bedrooms must be a number",
      })
      .optional(),
    location: z
      .string({
        required_error: "Location field is required",
        invalid_type_error: "Location must be a string",
      })
      .optional(),
    description: z
      .string({
        required_error: "Description field is required",
        invalid_type_error: "Description must be a string",
      })
      .optional(),
    rentAmount: z
      .number({
        required_error: "Rent Amount field is required",
        invalid_type_error: "Rent must be a number",
      })
      .optional(),
    amenities: z
      .array(
        z.string({
          required_error: "amenities field is required",
          invalid_type_error: "amenities must be a string",
        })
      )
      .optional(),
    photos: z
      .array(z.string().url("Each photo must be a valid URL"))
      .nonempty("At least one photo is required")
      .optional(),
  }),
});

const deleteFlatImage = z.object({
  body: z.object({
    imageLink: z
      .string({
        required_error: "Image Link field is required",
        invalid_type_error: "Image Link must be a string",
      })
      .optional(),
  }),
});

export const FlatValidationsSchema = {
  createFlat,
  updateFlat,
  deleteFlatImage,
};
