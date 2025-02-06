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

interface PaymentButtonProps {
  merch?: { id: string; quantity: number; size: Sizes; amount: number }[];
  total?: number;
  className?: string;
  disabled?: boolean;
  onClick?: () => Promise<void>;
  onStart?: () => void;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

const PaymentButton = ({
  merch,
  total,
  className,
  disabled,
  onClick,
  onStart,
  onSuccess,
  onError,
}: PaymentButtonProps) => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const purchaseMerch = api.merchandise.purchaseMerch.useMutation();
  const changePaymentStatus = api.razorpay.changePaymentStatus.useMutation();

  useEffect(() => {
    setIsLoading(purchaseMerch.isPending);
  }, [purchaseMerch.isPending]);

  useEffect(() => {
    setIsLoading(purchaseMerch.isPending);
  }, [purchaseMerch.isPending]);

  // Use disabled prop if provided, otherwise fall back on isLoading.
  const buttonDisabled = disabled ?? isLoading;

  const handleClick = async () => {
    try {
      if (merch && total) {
        onStart?.();
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
            try {
              if (response.razorpay_payment_id) {
                await changePaymentStatus.mutateAsync({
                  paymentOrderId: purchase.id,
                  merch: merch,
                  status: "SUCCESS",
                  response: response,
                });
                onSuccess?.();
              }
            } catch (error) {
              onError?.(error as Error);
            }
          },
        });

        paymentObject.open();
      }
    } catch (error) {
      onError?.(error as Error);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <button
        className={className}
        disabled={buttonDisabled}
        onClick={async () => {
          if (onClick) await onClick();
          else await handleClick();
        }}
      >
        {buttonDisabled
          ? "Processing..."
          : session?.user
            ? merch
              ? "Buy Now"
              : "Pay now"
            : "Login to Buy"}
      </button>
    </>
  );
};

export default PaymentButton;
