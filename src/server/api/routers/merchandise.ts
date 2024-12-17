import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../trpc";
import Razorpay from "razorpay";
import { env } from "~/env";

export const merchandiseRouter = createTRPCRouter({
  createMerch: adminProcedure
    .input(
      z.object({
        name: z.string().min(3),
        description: z.string(),
        image: z.string(),
        originalPrice: z.number(),
        discountPrice: z.number(),
        available: z.boolean(),
        stock: z.number(),
      }),
    )
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
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Could not get merchandise",
      });
    }
  }),
  getMerchById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        return ctx.db.merchandise.findUnique({
          where: {
            id: input.id,
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not get merchandise",
        });
      }
    }),
  updateMerch: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(3),
        description: z.string(),
        image: z.string(),
        originalPrice: z.number(),
        discountPrice: z.number(),
        available: z.boolean(),
        stock: z.number(),
      }),
    )
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
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not update merchandise",
        });
      }
    }),
  deleteMerch: adminProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return ctx.db.merchandise.delete({
          where: {
            id: input.id,
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not delete merchandise",
        });
      }
    }),
  purchaseMerch: protectedProcedure
    .input(
      z.object({
        merchId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const merch = await ctx.db.merchandise.findUnique({
          where: { id: input.merchId },
        });
        if (!merch) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Merchandise not found",
          });
        }
        // create order
        const order = await ctx.db.order.create({
          data: {
            user: {
              connect: {
                id: ctx.session.user.id,
              },
            },
            quantity: 1,
            merchandise: {
              connect: {
                id: merch.id,
              },
            },
          },
        });
        const rpClient = new Razorpay({
          key_id: env.RAZORPAY_KEY_ID,
          key_secret: env.RAZORPAY_KEY_SECRET,
        });
        // generate payment link
        const paymentLink = await rpClient.paymentLink.create({
          upi_link: true,
          amount: merch.discountPrice * 100,
          currency: "INR",
          customer: {
            name: ctx.session.user.name,
            email: ctx.session.user.email,
          },
          description: "Payment for " + merch.name,
          callback_url: env.HOME_URL,
        });
        //create payment order
        await ctx.db.paymentOrder.create({
          data: {
            amount: merch.discountPrice,
            order: {
              connect: {
                id: order.id,
              },
            },
            razorpayOrderID: paymentLink.id,
			status: "PENDING",
          },
        });
        return paymentLink;
      } catch (error) {
        console.log({ location: "purchaseMerch", error });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not create order",
        });
      }
    }),
});
