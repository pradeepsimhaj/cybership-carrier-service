import { z } from "zod";

export const PackageSchema = z.object({
  weightKg: z.number().positive(),
  lengthCm: z.number().positive(),
  widthCm: z.number().positive(),
  heightCm: z.number().positive()
});

export type Package = z.infer<typeof PackageSchema>;
