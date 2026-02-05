import { z } from "zod";

export const AddressSchema = z.object({
  postalCode: z.string().min(3),
  countryCode: z.string().length(2),
  city: z.string().optional(),
  state: z.string().optional()
});

export type Address = z.infer<typeof AddressSchema>;
