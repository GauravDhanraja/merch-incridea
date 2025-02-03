"use client";
import { type Sizes } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { api } from "~/trpc/react";

const PurchaseMerchButton = ({
  merch,
  total,
  className,
}: {
  merch: {
    id: string;
    quantity: number;
    size: Sizes;
  }[];
  total: number;
  className?: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const purchaseMerch = api.merchandise.purchaseMerch.useMutation();
  const getPaymentStatus = api.razorpay.getPaymentStatus.useQuery;
  const { data: session } = useSession();

  const handlePurchase = async () => {
    setIsLoading(true);
    try {
      const paymentLink = await purchaseMerch.mutateAsync({ merch, total });

      if (paymentLink?.success) {
        window.location.href = `/checkout?orderId=${paymentLink.orderId}`;

        const checkStatus = async () => {
          const statusResponse = getPaymentStatus({
            orderId: paymentLink.orderId,
          });
          if (statusResponse.status === "success") {
            alert("Payment successful!");
            window.location.reload();
          } else {
            setTimeout(() => {
              checkStatus().catch(console.error);
            }, 5000);
          }
        };

        await checkStatus();
      } else {
        alert("Failed to generate payment link.");
      }
    } catch (error) {
      console.error("Error purchasing merchandise:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className={`btn-default-styles ${className}`}
      onClick={handlePurchase}
      disabled={isLoading}
    >
      {isLoading ? "Processing..." : session?.user ? "Buy Now" : "Login to Buy"}
    </button>
  );
};

export default PurchaseMerchButton;
