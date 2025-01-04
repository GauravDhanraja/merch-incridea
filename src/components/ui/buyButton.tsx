import { useState } from "react";
import {api} from "~/trpc/react";

const PurchaseMerchButton = ({ merchId }: { merchId: string }) => {
    const [isLoading, setIsLoading] = useState(false);
    const purchaseMerch = api.merchandise.purchaseMerch.useMutation();

    const handlePurchase = async () => {
        setIsLoading(true);
        try {
            const paymentLink = await purchaseMerch.mutateAsync({ merchId });
            if (paymentLink?.short_url) {
                // Redirect to Razorpay payment link
                window.location.href = paymentLink.short_url;
            } else {
                alert("Failed to generate payment link.");
            }
        } catch (error) {
            console.error("Error purchasing merchandise:", error);
            alert("Failed to initiate purchase. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handlePurchase}
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded"
        >
            {isLoading ? "Processing..." : "Buy Now"}
        </button>
    );
};

export default PurchaseMerchButton;
