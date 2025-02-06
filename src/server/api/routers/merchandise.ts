import { TRPCError } from "@trpc/server";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../trpc";
import Razorpay from "razorpay";
import { env } from "~/env";
import { createMerchZ, purchaseMerchZ, updateMerchZ } from "~/zod/merchandiseZ";
import { idZ } from "~/zod/generalZ";

export const merchandiseRouter = createTRPCRouter({
  createMerch: adminProcedure
    .input(createMerchZ)
    .mutation(async ({ ctx, input }) => {
      try {
        return ctx.db.merchandise.create({
          data: {
            ...input,
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

  getAllMerch: publicProcedure.query(async ({ ctx }) => {
    try {
      return ctx.db.merchandise.findMany({});
    } catch (error) {
      console.log(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Could not get merchandise",
      });
    }
  }),

  getMerchSales: adminProcedure.query(async ({ ctx }) => {
    try {
      return ctx.db.merchandise
        .findMany({
          where: {
            OrderItem: {
              some: {
                Order: {
                  PaymentOrder: {
                    status: "SUCCESS",
                  },
                },
              },
            },
          },
        })
        .then((merchandise) => {
          return merchandise.map((item) => ({
            ...item,
          }));
        });
    } catch (error) {
      console.log(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Could not get merchandise",
      });
    }
  }),

  getMerchById: protectedProcedure.input(idZ).query(async ({ ctx, input }) => {
    try {
      return ctx.db.merchandise.findUnique({
        where: {
          id: input.id,
        },
      });
    } catch (error) {
      console.log(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Could not get merchandise",
      });
    }
  }),

  updateMerch: adminProcedure
    .input(updateMerchZ)
    .mutation(async ({ ctx, input }) => {
      try {
        return ctx.db.merchandise.update({
          where: {
            id: input.id,
          },
          data: {
            ...input,
          },
        });
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not update merchandise",
        });
      }
    }),

  deleteMerch: adminProcedure.input(idZ).mutation(async ({ ctx, input }) => {
    try {
      return ctx.db.merchandise.delete({
        where: {
          id: input.id,
        },
      });
    } catch (error) {
      console.log(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Could not delete merchandise",
      });
    }
  }),

  purchaseMerch: protectedProcedure
    .input(purchaseMerchZ)
    .mutation(async ({ ctx, input }) => {
      try {
        const order = await ctx.db.order.create({
          data: {
            userId: ctx.session.user.id,
            total: input.total,
            OrderItem: {
              createMany: {
                data: input.merch.map((item) => ({
                  merchandiseId: item.id,
                  quantity: item.quantity,
                  size: item.size,
                  total: item.amount * item.quantity,
                })),
              },
            },
          },
          include: {
            OrderItem: true,
          },
        });

        const rpClient = new Razorpay({
          key_id: env.RAZORPAY_KEY_ID,
          key_secret: env.RAZORPAY_KEY_SECRET,
        });

        const razorpayOrder = await rpClient.orders.create({
          amount: input.total * 100,
          currency: "INR",
          receipt: order.id,
          payment_capture: true,
        });

        if (!razorpayOrder.id) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create Razorpay order",
          });
        }

        return await ctx.db.paymentOrder.create({
          data: {
            orderId: order.id,
            razorpayOrderID: razorpayOrder.id,
            amount: input.total,
            status: "PENDING",
          },
        });
      } catch (error) {
        console.error("purchaseMerch error details:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not create order. Please try again.",
        });
      }
    }),
});
