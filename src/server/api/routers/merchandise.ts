import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure, protectedProcedure, adminProcedure } from "../trpc";
import { z } from "zod";

export const merchandiseRouter = createTRPCRouter({
    createMerch: adminProcedure
        .input(z.object({
            name: z.string().min(3),
            description: z.string(),
            image: z.string(),
            originalPrice: z.number(),
            discountPrice: z.number(),
            available: z.boolean(),
            stock: z.number()
        }))
        .mutation(async ({ ctx, input }) => {
            try {
                return ctx.db.merchandise.create({
                    data: {
                        ...input
                    }
                });
            }
            catch (err) {
                console.log(err);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Could not create merchandise"
                });
            }
        }),
    getAllMerch: publicProcedure
        .query(async ({ ctx }) => {
            try {
                return ctx.db.merchandise.findMany({});
            } catch (error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Could not get merchandise"
                });
            }
        }),
    getMerchById: protectedProcedure
        .input(z.object({
            id: z.string()
        }))
        .query(async ({ ctx, input }) => {
            try {
                return ctx.db.merchandise.findUnique({
                    where: {
                        id: input.id
                    }
                })
            } catch (error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Could not get merchandise"
                });

            }
        }),
    updateMerch: adminProcedure
        .input(z.object({
            id: z.string(),
            name: z.string().min(3),
            description: z.string(),
            image: z.string(),
            originalPrice: z.number(),
            discountPrice: z.number(),
            available: z.boolean(),
            stock: z.number()
        }))
        .mutation(async ({ ctx, input }) => {
            try {
                return ctx.db.merchandise.update({
                    where: {
                        id: input.id
                    },
                    data: {
                        ...input
                    }
                })
            } catch (error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Could not update merchandise"
                });

            }
        }),
    deleteMerch: adminProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            try {
                return ctx.db.merchandise.delete({
                    where: {
                        id: input.id
                    }
                })
            } catch (error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Could not delete merchandise"
                });

            }
        }),
});