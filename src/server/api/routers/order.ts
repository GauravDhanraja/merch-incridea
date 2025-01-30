import { TRPCError } from "@trpc/server";
import { adminProcedure, createTRPCRouter, protectedProcedure } from "../trpc";

export const orderRouter = createTRPCRouter({
  getAllUserOrders: adminProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.db.order.findMany({
        include: {
          User: {
            select: {
              name: true,
              email: true,
            },
          },
          PaymentOrder: {
            select: {
              amount: true,
              id: true,
              status: true,
              razorpayOrderID: true,
            },
          },
          OrderItem: {
            select: {
              Merchandise: {
                select: { name: true },
              },
            },
          },
        },
      });
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Could not get orders",
      });
    }
  }),

  getUserOrders: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.order.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
});
