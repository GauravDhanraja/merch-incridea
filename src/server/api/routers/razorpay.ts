import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { z } from "zod";

export const razorPayRouter = createTRPCRouter({
  getPaymentStatus: protectedProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ input, ctx }) => {
      const payment = await ctx.db.paymentOrder.findUnique({
        where: { razorpayOrderID: input.orderId },
        select: { status: true },
      });

      if (!payment) {
        throw new Error("Payment order not found");
      }

      return { status: payment.status };
    }),

  getAllTransactions: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.paymentOrder.findMany({
      select: { amount: true },
    });
  }),
});
