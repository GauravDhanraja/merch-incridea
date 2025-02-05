import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import { Sizes, Status } from "@prisma/client";

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

  changePaymentStatus: protectedProcedure
    .input(
      z.object({
        paymentOrderId: z.string(),
        merch: z
          .object({
            id: z.string(),
            quantity: z.number(),
            size: z.nativeEnum(Sizes),
          })
          .array(),
        status: z.nativeEnum(Status),
        response: z.unknown(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.db.paymentOrder.update({
        where: {
          id: input.paymentOrderId,
        },
        data: {
          status: input.status,
          paymentData: input.response ?? {},
        },
      });

      if (input.status === "SUCCESS") {
        await Promise.all(
          input.merch.map(async (item) => {
            await ctx.db.merchandise.update({
              where: { id: item.id },
              data: { stock: { decrement: item.quantity } },
            });
          }),
        );
      }

      return order;
    }),
});
