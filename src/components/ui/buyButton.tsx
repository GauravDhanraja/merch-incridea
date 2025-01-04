import { useState } from "react";
import { api } from "~/trpc/react";

const PurchaseMerchButton = ({ merchId, merchQuantity }: { merchId: string, merchQuantity: number }) => {
  const [isLoading, setIsLoading] = useState(false);
  const purchaseMerch = api.merchandise.purchaseMerch.useMutation();

  const handlePurchase = async () => {
    setIsLoading(true);
    try {
      const paymentLink = await purchaseMerch.mutateAsync({ merchId, merchQuantity });
      if (paymentLink?.short_url) {
        // Redirect to Razorpay payment link
        window.location.href = paymentLink.short_url;
      } else {
        alert("Failed to generate payment link.");
      }
    } catch (error) {
      console.error("Error purchasing merchandise:", error);
      if (error.message == "UNAUTHORIZED") {
        alert("Have you signed in?")
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePurchase}
      disabled={isLoading}
      className="mt-8 h-16 w-full cursor-pointer select-none justify-center rounded-full bg-palate_1 py-5 text-center font-bold text-palate_3      active:bg-white/80 md:active:bgactive:text-black md:hover:bg-palate_1/80 md:hover:text-text_1 shadow-2xl"
    >
      {isLoading ? "Processing..." : "Buy Now"}
    </button>
  );
};

export default PurchaseMerchButton;
