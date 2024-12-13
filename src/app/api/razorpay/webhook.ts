/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { NextApiRequest, NextApiResponse } from "next";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils";

import { env } from "~/env";
import { db } from "~/server/db";

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    throw new Error("Method not allowd");
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
      // find payment order from two tables
      const paymentOrder = await db.paymentOrder.findUnique({
        where: {
          orderId: order_id,
        },
      });

      if (paymentOrder) {
        const updatedPaymentOrder = await db.paymentOrder.update({
          where: {
            orderId: order_id,
          },
          data: {
            status: "SUCCESS",
            paymentData: req.body.payload.payment.entity.paymentData,
          },
        });

        res.status(200).json(updatedPaymentOrder);
        return;
      }
    } else {
      await db.paymentOrder.update({
        where: {
          orderId: order_id,
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
