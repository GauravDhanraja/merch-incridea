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
  const { data: session } = useSession();

  const handlePurchase = async () => {
    setIsLoading(true);
    try {
      const paymentLink = await purchaseMerch.mutateAsync({
        merch,
        total,
      });
      if (paymentLink?.short_url) {
        // Redirect to Razorpay payment link
        window.location.href = paymentLink.short_url;
        // Add event listener for payment success
        // window.addEventListener("payment.success", async (event: any) => {
        //   await handlePaymentSuccess(paymentLink.id);
        // });
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
      disabled={isLoading} // Replace with your buy function
    >
      {isLoading ? "Processing..." : session?.user ? "Buy Now" : "Login to Buy"}
    </button>
  );
};

export default PurchaseMerchButton;
