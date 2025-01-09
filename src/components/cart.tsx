"use client";
import { Merchandise, type Cart } from "@prisma/client";
import { X } from "lucide-react";
import React, { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { api } from "~/trpc/react";

interface Props {
  cartItems: (Cart & {
    Merchandise: Merchandise;
  })[];
  isLoading: boolean;
}

export default function Cart({ cartItems, isLoading }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const addItemToCart = api.cart.addItemToCart.useMutation();
  const removeItemFromCart = api.cart.removeItemFromCart.useMutation();
  const clearCart = api.cart.clearCart.useMutation();

  return (
    <div className="fixed bottom-4 right-4">
      <button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white"
      >
        <FaShoppingCart />
        {cartItems.length > -1 && (
          <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white">
            {cartItems.length}
          </div>
        )}
      </button>
      {isOpen && (
        <div className="absolute bottom-16 right-0 h-[40rem] w-[30rem] rounded-lg bg-white p-5 shadow-lg">
          <div className="flex h-full flex-col items-center justify-between">
            <div className="flex w-full items-center justify-between">
              <h1>
                <span className="font-semibold">Merch</span>Cart
              </h1>
              <button
                onClick={() => {
                  setIsOpen(false);
                }}
                className="flex size-12 items-center justify-center rounded-full bg-white"
              >
                <X />
              </button>
            </div>

            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <div>
                {cartItems?.map((item) => (
                  <div key={item.id}>
                    <div>{item.Merchandise.name}</div>
                    <div>{item.quantity}</div>
                  </div>
                ))}
              </div>
            )}

            <div> </div>
          </div>
        </div>
      )}
    </div>
  );
}
