import { z } from "zod";

export const createMerchZ = z.object({
  name: z.string().min(3),
  description: z.string(),
  image: z.string(),
  originalPrice: z.number(),
  discountPrice: z.number(),
  available: z.boolean(),
  stock: z.number(),
});

export const updateMerchZ = z.object({
  id: z.string(),
  name: z.string().min(3),
  description: z.string(),
  image: z.string(),
  originalPrice: z.number(),
  discountPrice: z.number(),
  available: z.boolean(),
  stock: z.number(),
});

export const purchaseMerchZ = z.object({
  merchId: z.string(),
  merchQuantity: z.number(),
});
