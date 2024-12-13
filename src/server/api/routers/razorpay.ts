import { Status } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import Razorpay from "razorpay";
import { z } from "zod";
import { env } from "~/env";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../trpc";
import { JsonObject } from "next-auth/adapters";

export const razorpayRouter = createTRPCRouter({
  initiateRefund: adminProcedure
    .input(
      z.object({
        paymentId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const paymentOrder = await ctx.db.paymentOrder.findUnique({
          where: {
            id: input.paymentId,
          },
        });
        if (!paymentOrder) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Payment order not found",
          });
        }

        const razorpayInstance = new Razorpay({
          key_id: env.RAZORPAY_KEY_ID,
          key_secret: env.RAZORPAY_KEY_SECRET,
        });

        const refundRes = await razorpayInstance.payments.refund(
          input.paymentId,
          {
            amount: paymentOrder?.amount * 100, // amount in paise, TODO: Check if this is correct
            speed: "normal",
            notes: {
              reason: "Refund initiated by admin",
            },
          },
        );

        return ctx.db.paymentOrder.update({
          where: {
            id: input.paymentId,
          },
          data: {
            status: "REFUNDED",
            paymentData: {
              ...(paymentOrder.paymentData as JsonObject),
              refundData: {
                refundData: { refundId: refundRes.id, notes: refundRes.notes },
              },
            },
          },
        });
      } catch (err) {
        console.log(err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not create merchandise",
        });
      }
    }),
  getAllTransactions: publicProcedure.query(async ({ ctx }) => {
    try {
      return ctx.db.paymentOrder.findMany({});
    } catch (error) {
      console.log({
        location: "getAllTransactions",
        error,
      });
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Could not get merchandise",
      });
    }
  }),
  getTransactionDetailsById: protectedProcedure
    .input(
      z.object({
        paymentId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        return ctx.db.paymentOrder.findUnique({
          where: {
            id: input.paymentId,
          },
        });
      } catch (error) {
        console.log({
          location: "getTransactionDetailsById",
          error,
        });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not get merchandise",
        });
      }
    }),
  getTransactionByStatus: protectedProcedure
    .input(
      z.object({
        status: z.nativeEnum(Status),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        return ctx.db.paymentOrder.findMany({
          where: {
            status: input.status,
          },
        });
      } catch (error) {
        console.log({
          location: "getTransactionByStatus",
          error,
        });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not get merchandise",
        });
      }
    }),
});
