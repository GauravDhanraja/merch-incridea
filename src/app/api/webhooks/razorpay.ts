/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
export const config = {
  api: {
    bodyParser: false,
  },
};

import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { env } from "~/env";
import { db } from "~/server/db";

// Helper to read raw body
async function buffer(req: NextApiRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    req.on("data", (chunk) =>
      chunks.push(
        typeof chunk === "string" ? Buffer.from(chunk) : (chunk as Uint8Array),
      ),
    );
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", (err) => reject(err));
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const buf = await buffer(req);
    const bodyStr = buf.toString("utf8");
    const razorpaySignature = req.headers["x-razorpay-signature"] as string;
    if (!razorpaySignature) {
      return res.status(400).json({ error: "Missing signature header" });
    }
    const webhookSecret = env.RAZORPAY_WEBHOOK_SECRET;
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(bodyStr)
      .digest("hex");

    // Constant time comparison
    const expectedBuffer = Buffer.from(expectedSignature, "utf8");
    const receivedBuffer = Buffer.from(razorpaySignature, "utf8");
    if (
      expectedBuffer.length !== receivedBuffer.length ||
      !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
    ) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    // Parse and validate webhook payload
    let webhookData;
    try {
      webhookData = JSON.parse(bodyStr);
    } catch (parseError) {
      return res.status(400).json({ error: "Invalid JSON payload" });
    }

    const event = webhookData.event;
    const payment = webhookData.payload.payment.entity;

    if (event === "payment.captured") {
      // 2️⃣ Find the Payment Order
      const paymentOrder = await db.paymentOrder.findUnique({
        where: { razorpayOrderID: payment.order_id },
        include: { Order: { include: { OrderItem: true } } },
      });

      if (!paymentOrder) {
        return res.status(404).json({ error: "Payment order not found" });
      }

      // 3️⃣ Update Payment Status
      await db.paymentOrder.update({
        where: { id: paymentOrder.id },
        data: { status: "SUCCESS", paymentData: payment },
      });

      // 4️⃣ Decrement Merchandise Stock
      await Promise.all(
        paymentOrder.Order.OrderItem.map(async (item) => {
          await db.merchandise.update({
            where: { id: item.merchandiseId },
            data: { stock: { decrement: item.quantity } },
          });
        }),
      );

      return res.status(200).json({ success: true });
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
