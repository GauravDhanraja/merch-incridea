"use client";
import type { Merchandise, Sizes, Cart } from "@prisma/client";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { api } from "~/trpc/react";
import PurchaseMerchButton from "~/components/ui/buyButton";
import { useSession } from "next-auth/react";

interface Props {
  cartItems: (Cart & {
    Merchandise: Merchandise;
  })[];
  isLoading: boolean;
}

export default function Cart({
  cartItems: initialCartItems,
  isLoading,
}: Props) {
  const { data: session } = useSession();
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [isOpen, setIsOpen] = useState(false);

  const removeItemFromCart = api.cart.removeItemFromCart.useMutation();
  const clearCart = api.cart.clearCart.useMutation();

  // Calculate total price
  const total = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.Merchandise.discountPrice,
    0,
  );

  // Prepare data for the PurchaseMerchButton
  const merchData: {
    id: string;
    quantity: number;
    size: Sizes;
  }[] = cartItems.map((item) => ({
    id: item.Merchandise.id,
    quantity: item.quantity,
    size: "FREE_SIZE",
  }));

  // Update cartItems on removal
  const handleRemoveItem = async (id: string) => {
    await removeItemFromCart.mutateAsync({ id });
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.Merchandise.id !== id),
    );
  };

  // Clear all items in cart
  const handleClearCart = async () => {
    await clearCart.mutateAsync();
    setCartItems([]);
  };

  useEffect(() => {
    setCartItems(initialCartItems);
  }, [initialCartItems]);

  return (
    <div className="fixed bottom-4 right-4">
      {/* Floating Cart Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-12 w-12 items-center justify-center rounded-full bg-palate_1 text-palate_2 shadow-lg"
      >
        <FaShoppingCart size={20} />
        {cartItems.length > 0 && (
          <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-700 text-sm font-semibold text-white">
            {cartItems.length}
          </div>
        )}
      </button>

      {/* Cart Popup */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 rounded-lg bg-palate_1/80 lg:bg-palate_1 backdrop-blur-3xl p-4 shadow-2xl">
          {/* Cart Header */}
          <div className="flex items-center justify-between border-b border-white/20 pb-2">
            <h1 className="text-lg font-semibold text-palate_2">
              <span className="font-bold">Merch</span> Cart
            </h1>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 text-palate_2 hover:bg-palate_2 hover:text-palate_1"
            >
              <X size={18} />
            </button>
          </div>

          {/* Check if user is logged in */}
          {!session?.user ? (
            <div className="mt-4 text-center text-palate_2">Login to Use Cart</div>
          ) : isLoading ? (
            <div className="mt-4 text-center text-palate_2">Loading...</div>
          ) : cartItems.length === 0 ? (
            <div className="mt-4 text-center text-palate_2">
              Your cart is empty.
            </div>
          ) : (
            <div className="mt-4 max-h-56 space-y-4 overflow-y-auto">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg bg-palate_3 border border-palate_2/40 p-3 shadow"
                >
                  <div>
                    <p className="text-sm font-bold text-gray-700">
                      {item.Merchandise.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-xs text-gray-500">
                      Price: ₹{item.Merchandise.discountPrice}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.Merchandise.id)}
                    className="rounded-full bg-red-700 px-2 py-1 text-xs text-white shadow hover:bg-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="mt-4 border-t border-white/20 pt-4">
              <div className="flex justify-between text-white">
                <span className="font-bold">Total:</span>
                <span className="font-bold">₹{total.toFixed(2)}</span>
              </div>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={handleClearCart}
                  className="rounded-full bg-red-700 px-3 py-1 text-sm text-white shadow hover:bg-red-800"
                >
                  Clear Cart
                </button>
                <PurchaseMerchButton
                  merch={merchData}
                  total={total}
                  className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-emerald-600 shadow hover:bg-gray-100"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
