import { useState } from "react";
import { api } from "~/trpc/react";

const PurchaseMerchButton = ({
  merchId,
  merchQuantity,
}: {
  merchId: string;
  merchQuantity: number;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const purchaseMerch = api.merchandise.purchaseMerch.useMutation();

  const handlePurchase = async () => {
    setIsLoading(true);
    try {
      const paymentLink = await purchaseMerch.mutateAsync({
        merchId,
        merchQuantity,
      });
      if (paymentLink?.short_url) {
        // Redirect to Razorpay payment link
        window.location.href = paymentLink.short_url;
      } else {
        alert("Failed to generate payment link.");
      }
    } catch (error) {
      console.error("Error purchasing merchandise:", error);
      if (error.message == "UNAUTHORIZED") {
        alert("Have you signed in?");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className="mt-2 items-center rounded-lg bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600"
      onClick={handlePurchase}
      disabled={isLoading} // Replace with your buy function
    >
      {isLoading ? "Processing..." : "Buy Now"}
    </button>
  );
};

export default PurchaseMerchButton;
