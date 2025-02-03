/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { NextApiRequest, NextApiResponse } from "next";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils";

import { env } from "~/env";
import { db } from "~/server/db";

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    throw new Error("Method not allowed");
  }

  const webhookSecret = env.RAZORPAY_WEBHOOK_SECRET;
  const webhookSignature = req.headers["x-razorpay-signature"] as string;
  if (
    !validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      webhookSecret,
    )
  ) {
    res.status(400).send({ message: "Invalid request" });
    return;
  }

  try {
    const order_id = req.body?.payload?.payment?.entity?.order_id as string;
    const status = req.body?.payload?.payment?.entity?.status as string;
    if (!order_id || !status) {
      res.status(400).send({ message: "Invalid request" });
      return;
    }

    if (status === "captured") {
      // find payment order by razorpayOrderID instead of orderId
      const paymentOrder = await db.paymentOrder.findUnique({
        where: {
          razorpayOrderID: order_id,
        },
        include: {
          Order: {
            select: {
              merchandiseId: true,
            },
          },
        },
      });

      if (
        paymentOrder &&
        paymentOrder.status === "PENDING" &&
        paymentOrder.Order.merchandiseId
      ) {
        const updatedPaymentOrder = await db.paymentOrder.update({
          where: {
            razorpayOrderID: order_id,
          },
          data: {
            status: "SUCCESS",
            paymentData: req.body.payload.payment.entity.paymentData,
          },
        });

        const stockUpdate = await db.merchandise.update({
          where: {
            id: paymentOrder.Order.merchandiseId,
          },
          data: {
            stock: {
              decrement: 1,
            },
          },
        });

        res.status(200).json(updatedPaymentOrder);
        return;
      }
    } else {
      await db.paymentOrder.update({
        where: {
          razorpayOrderID: order_id,
        },
        data: {
          status: "FAILED",
          paymentData: req.body.payload.payment.entity.paymentData,
        },
      });
    }
  } catch (err) {
    res.status(400).json(err);
    return;
  }
}
