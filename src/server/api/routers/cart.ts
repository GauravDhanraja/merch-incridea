import { idZ } from "~/zod/generalZ";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const cartRouter = createTRPCRouter({
  getUserCart: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.cart.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        Merchandise: true,
      },
    });
  }),

  addItemToCart: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        quantity: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const item = await ctx.db.cart.findFirst({
        where: {
          merchandiseId: input.id,
          userId: ctx.session.user.id,
        },
      });

      if (!item) {
        return await ctx.db.cart.create({
          data: {
            merchandiseId: input.id,
            userId: ctx.session.user.id,
            quantity: input.quantity,
          },
        });
      }

      return await ctx.db.cart.update({
        where: {
          id: item.id,
        },
        data: {
          quantity: item.quantity + input.quantity,
        },
      });
    }),

  removeItemFromCart: protectedProcedure
    .input(idZ)
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.cart.deleteMany({
          where: {
            merchandiseId: input.id,
            userId: ctx.session.user.id,
          },
        });
      } catch (e) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Item not found in cart",
        });
      }
    }),

  clearCart: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.db.cart.deleteMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
});
