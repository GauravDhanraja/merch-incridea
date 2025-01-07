import { z } from "zod";

export const idZ = z.object({
  id: z.string(),
});
