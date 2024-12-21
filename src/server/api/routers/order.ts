import { TRPCError } from "@trpc/server";
import {
    adminProcedure,
    createTRPCRouter,
    publicProcedure,
} from "../trpc";

export const orderRouter = createTRPCRouter({
    getAllUserOrders: publicProcedure.query(async ({ ctx }) => {
        try {
            const orders = await ctx.db.order.findMany({
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true
                        }
                    },
                    paymentOrder: {
                        select: {
                            amount: true,
                            id: true,
                            status: true,
                            razorpayOrderID: true,
                        }
                    },
                    merchandise: {
                        select: {
                            name: true,
                        }
                    }
                }
            });

            return orders.map(order => ({
                ...order,
                username: order.user?.name,
                email: order.user?.email,
                totalAmount: order?.paymentOrder?.amount,
                paymentStatus: order.paymentOrder?.status,
                paymentId: order.paymentOrder?.id,
                merchName: order.merchandise?.name
            }));

        } catch (error) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Could not get orders",
            });
        }
    }),
});