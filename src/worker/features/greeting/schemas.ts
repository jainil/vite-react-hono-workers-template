import { z } from "zod";

export const greetingSchema = z
  .object({ name: z.string() })
  .meta({ ref: "Greeting" });

export const greetingQuerySchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
});
