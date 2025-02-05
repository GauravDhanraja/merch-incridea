/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { use, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Script from "next/script";
import { Button } from "~/components/ui/button";
import { env } from "~/env";
import { api } from "~/trpc/react";
import type { Sizes } from "@prisma/client";

const PaymentButton = ({
  merch,
  total,
  className,
}: {
  merch?: {
    id: string;
    quantity: number;
    size: Sizes;
  }[];
  total?: number;
  className?: string;
}) => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const purchaseMerch = api.merchandise.purchaseMerch.useMutation();
  const changePaymentStatus = api.razorpay.changePaymentStatus.useMutation();

  useEffect(() => {
    if (purchaseMerch.isPending) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [purchaseMerch.isPending]);

  const handleClick = async () => {
    if (merch && total) {
      const purchase = await purchaseMerch.mutateAsync({
        merch: merch,
        total: total,
      });

      const paymentObject = new (window as any).Razorpay({
        key: env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        order_id: purchase.razorpayOrderID,
        amount: purchase.amount,
        currency: "INR",
        name: "Merch Incridea",
        description: "Merchandise Purchase",
        notes: {
          address: "NMAM Institute of Technology, Nitte, Karkala",
        },
        theme: {
          color: "#04382b",
        },
        handler: async (response: any) => {
          console.log(response);
          if (response.razorpay_payment_id) {
            await changePaymentStatus.mutateAsync({
              paymentOrderId: purchase.id,
              merch: merch,
              status: "SUCCESS",
              response: response,
            });
          }
        },
      });

      paymentObject.open();
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <Button
        className={className}
        disabled={isLoading}
        onClick={async () => {
          await handleClick();
        }}
      >
        {isLoading
          ? "Processing..."
          : session?.user
            ? merch
              ? "Buy Now"
              : "Pay now"
            : "Login to Buy"}
      </Button>
    </>
  );
};

export default PaymentButton;
