"use client";

import { Sizes, type Merchandise } from "@prisma/client";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import CircleLoader from "~/components/ui/loader-circle-progress";
import { api } from "~/trpc/react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight, FaPlus, FaMinus } from "react-icons/fa";
import BuyButton from "~/components/ui/buyButton";
import Cart from "~/components/cart";

export default function Shop() {
  const { data: allMerchData, isLoading } =
    api.merchandise.getAllMerch.useQuery();
  const [merchData, setMerchData] = useState<
    (Merchandise & { count: number })[]
  >([]);
  type sizeType = Record<Sizes, number>;
  const rzpWebhook = api.razorpay.handleWebhook.useMutation();
  const [activeCard, setActiveCard] = useState<number>(0);
  const {
    data: userCartData,
    isLoading: cartLoading,
    refetch: cartRefetch,
  } = api.cart.getUserCart.useQuery();
  const addItemToCart = api.cart.addItemToCart.useMutation();
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [showBulkOrderForm, setShowBulkOrderForm] = useState(false);
  const [sizes, setSizes] = useState<sizeType>({
    S: 0,
    M: 0,
    L: 0,
    XL: 0,
    XXL: 0,
    FREE_SIZE: 0,
  });
  const [bulkTotalCost, setBulkTotalCost] = useState(0);
  const [bulkTotalQty, setBulkTotalQty] = useState(0);
  const [tshirtData, setTshirtData] = useState<Merchandise[]>([]);

  const { data: session } = useSession();

  const handleSizeChange = (size: string, quantity: number): void => {
    setSizes((prev: sizeType) => {
      const updatedSizes: sizeType = { ...prev, [size]: Math.max(0, quantity) };
      calculateBulkTotalCost(updatedSizes);
      return updatedSizes;
    });
  };

  const calculateBulkTotalCost = (updatedSizes: sizeType): void => {
    const totalQuantity: number = Object.values(updatedSizes).reduce(
      (total: number, qty: number) => total + qty,
      0,
    );

    const discountPrice: number =
      tshirtData[0]?.discountPrice !== undefined
        ? tshirtData[0].discountPrice
        : 0;
    setBulkTotalQty(totalQuantity);
    setBulkTotalCost(totalQuantity * discountPrice);
  };

  useEffect(() => {
    if (allMerchData) {
      setMerchData(
        allMerchData.map((item) => ({
          ...item,
          count: 1,
        })),
      );
      setTshirtData(allMerchData.filter((item) => item.bulkOrder));
    }
  }, [allMerchData]);

  const handlePaymentSuccess = async (razorpayOrderId: string) => {
    try {
      await rzpWebhook.mutateAsync({
        razorpayOrderId,
        status: "SUCCESS",
      });
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };
  const handleNextCard = () => {
    setActiveCard((prev) => {
      const nextCard = (prev + 1) % merchData.length;
      cardRefs.current[nextCard]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return nextCard;
    });
  };

  const handlePreviousCard = () => {
    setActiveCard((prev) => {
      const prevCard = (prev - 1 + merchData.length) % merchData.length;
      cardRefs.current[prevCard]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return prevCard;
    });
  };

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-x-hidden bg-gradient-to-bl from-emerald-950 to-emerald-800 pt-24 lg:overflow-y-hidden lg:pt-20">
      {isLoading ? (
        <CircleLoader />
      ) : (
        <div className="flex min-h-screen w-full flex-col items-center justify-start space-y-8 p-4 pt-28 lg:justify-center lg:pt-6">
          <div className="flex flex-wrap justify-center gap-14">
            <div className="flex flex-wrap justify-center gap-14">
              {merchData.map((item, index) =>
                item.bulkOrder ? (
                  <>
                    <div
                      key={item.id}
                      ref={(el) => {
                        if (el) cardRefs.current[0] = el;
                      }}
                      data-index={index}
                      onClick={() => setActiveCard(index)}
                      className={`relative cursor-pointer rounded-2xl p-4 shadow-lg transition-all duration-300 lg:rounded-3xl lg:p-6 ${
                        activeCard === index
                          ? "h-[400px] w-72 scale-105 bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white lg:h-[450px] lg:w-80"
                          : "h-[350px] w-64 scale-95 bg-gradient-to-tr from-emerald-700 to-emerald-500 text-gray-300 lg:h-[400px] lg:w-72"
                      }`}
                    >
                      {activeCard === index && (
                        <button
                          className="absolute left-3 top-8 p-0 text-white hover:text-gray-200 lg:left-4 lg:top-10"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreviousCard();
                          }}
                        >
                          <FaChevronLeft size={24} />
                        </button>
                      )}
                      {activeCard === index && (
                        <button
                          className="absolute right-3 top-8 p-0 text-white hover:text-gray-200 lg:right-4 lg:top-10"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNextCard();
                          }}
                        >
                          <FaChevronRight size={24} />
                        </button>
                      )}
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 transform overflow-visible lg:-top-16">
                        <div className="h-36 w-36 lg:h-48 lg:w-48">
                          <Image
                            src={item.image}
                            alt={item.name}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-full"
                          />
                        </div>
                      </div>
                      <div className="mt-24 text-center lg:mt-28">
                        <h2
                          className={
                            activeCard === index
                              ? "text-xl font-extrabold text-palate_1/90 lg:text-2xl"
                              : "text-lg font-semibold text-palate_1/60 lg:text-xl"
                          }
                        >
                          {item.name}
                        </h2>
                        <p
                          className={
                            activeCard === index
                              ? "text-sm font-semibold text-palate_1/90 lg:text-base"
                              : "text-xs font-normal text-palate_1/60 lg:text-sm"
                          }
                        >
                          {item.description}
                        </p>
                        <p
                          className={
                            activeCard === index
                              ? "text-lg font-extrabold text-palate_1/90 lg:text-2xl"
                              : "text-base font-medium text-palate_1/60 lg:text-lg"
                          }
                        >
                          ₹{item.discountPrice}
                        </p>
                        {activeCard === index && (
                          <div className="mt-6">
                            {session?.user.role === "CLASS_REP" ? (
                              <button
                                className="rounded-full bg-white px-6 py-2 font-bold tracking-wide text-black lg:px-8 lg:py-3"
                                onClick={() => setShowBulkOrderForm(true)}
                              >
                                Bulk Order
                              </button>
                            ) : (
                              <button
                                disabled
                                className="cursor-not-allowed rounded-full bg-white px-6 py-2 font-bold tracking-wide text-black lg:px-8 lg:py-3"
                              >
                                Buy through CR
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div
                    key={item.id}
                    ref={(el) => {
                      if (el) cardRefs.current[index] = el;
                    }}
                    onClick={() => setActiveCard(index)}
                    className={`relative cursor-pointer rounded-2xl p-4 shadow-lg transition-all duration-300 lg:rounded-3xl lg:p-6 ${
                      activeCard === index
                        ? "h-[400px] w-72 scale-105 bg-gradient-to-tr from-emerald-700 to-emerald-500 text-white lg:h-[450px] lg:w-80"
                        : "h-[350px] w-64 scale-95 bg-gradient-to-tr from-emerald-800 to-emerald-600 text-gray-300 lg:h-[400px] lg:w-72"
                    }`}
                  >
                    {activeCard === index && (
                      <button
                        className="absolute left-3 top-8 p-0 text-white hover:text-gray-200 lg:left-4 lg:top-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePreviousCard();
                        }}
                      >
                        <FaChevronLeft size={24} color="white" />
                      </button>
                    )}
                    {activeCard === index && (
                      <button
                        className="absolute right-3 top-8 p-0 text-white hover:text-gray-200 lg:right-4 lg:top-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNextCard();
                        }}
                      >
                        <FaChevronRight size={24} color="white" />
                      </button>
                    )}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 transform overflow-visible lg:-top-16">
                      <div className="h-36 w-36 lg:h-48 lg:w-48">
                        <Image
                          src={item.image}
                          alt={item.name}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-full"
                        />
                      </div>
                    </div>
                    <div className="mt-24 text-center lg:mt-28">
                      <h2
                        className={
                          activeCard === index
                            ? "text-xl font-extrabold text-palate_1/90 lg:text-2xl"
                            : "text-lg font-semibold text-palate_1/60 lg:text-xl"
                        }
                      >
                        {item.name}
                      </h2>
                      <p
                        className={
                          activeCard === index
                            ? "text-sm font-semibold text-palate_1/90 lg:text-base"
                            : "text-xs font-normal text-palate_1/60 lg:text-sm"
                        }
                      >
                        {item.description}
                      </p>
                      <p
                        className={
                          activeCard === index
                            ? "text-lg font-extrabold text-palate_1/90 lg:text-2xl"
                            : "text-base font-medium text-palate_1/60 lg:text-lg"
                        }
                      >
                        ₹{item.discountPrice}
                      </p>
                      <div
                        className={`mt-6 flex items-center justify-center gap-3 ${
                          activeCard !== index ? "hidden" : ""
                        }`}
                      >
                        <button
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-lg font-bold lg:h-10 lg:w-10 lg:text-xl"
                          onClick={(e) => {
                            e.stopPropagation();
                            setMerchData((prev) =>
                              prev.map((prod, idx) =>
                                idx === index
                                  ? {
                                      ...prod,
                                      count: Math.max(prod.count - 1, 1),
                                    }
                                  : prod,
                              ),
                            );
                          }}
                        >
                          <FaMinus className="text-gray-700" />
                        </button>
                        <span className="px-3 text-lg font-medium text-white lg:px-4 lg:text-xl">
                          {item.count}
                        </span>
                        <button
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-lg font-bold lg:h-10 lg:w-10 lg:text-xl"
                          onClick={(e) => {
                            e.stopPropagation();
                            setMerchData((prev) =>
                              prev.map((prod, idx) =>
                                idx === index
                                  ? { ...prod, count: prod.count + 1 }
                                  : prod,
                              ),
                            );
                          }}
                        >
                          <FaPlus className="text-gray-700" />
                        </button>
                      </div>
                      {activeCard === index && (
                        <div className="mt-4 flex flex-wrap justify-center gap-2 lg:mt-6 lg:gap-3">
                          <BuyButton
                            merch={[
                              {
                                id: item.id,
                                quantity: item.count,
                                size: "FREE_SIZE",
                              },
                            ]}
                            total={item.discountPrice * item.count}
                            className="rounded-full bg-white px-6 py-2 font-bold tracking-wide text-black lg:px-8 lg:py-3"
                          />
                          {session?.user ? (
                            <button
                              className="rounded-full bg-white px-6 py-2 font-bold tracking-wide text-black lg:px-8 lg:py-3"
                              onClick={async () => {
                                await addItemToCart.mutateAsync({
                                  id: item.id,
                                  quantity: item.count,
                                });
                                await cartRefetch();
                              }}
                            >
                              Add to Cart
                            </button>
                          ) : (
                            <button className="cursor-not-allowed rounded-full bg-white px-6 py-2 font-bold tracking-wide text-black lg:px-8 lg:py-3">
                              Login for Cart
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      )}
      {/* Modal for Bulk Order */}
      {showBulkOrderForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-lg bg-gradient-to-tr from-emerald-700 to-emerald-500 p-6 shadow-lg">
            <button
              onClick={() => setShowBulkOrderForm(false)}
              className="absolute right-2 top-2 rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
            >
              ✕
            </button>
            <h2 className="mb-4 text-xl font-bold text-white">
              Bulk Order Request
            </h2>
            <form className="space-y-4">
              {/* Sizes and Quantities */}
              <div>
                <h3 className="mb-2 font-semibold text-white">T-Shirt Sizes</h3>
                {["S", "M", "L", "XL", "XXL"].map((size, index) => (
                  <div
                    key={index}
                    className="mb-2 flex items-center justify-between"
                  >
                    <label
                      htmlFor={`size-${index}`}
                      className="font-semibold text-white"
                    >
                      {size}
                    </label>
                    <input
                      type="number"
                      id={`size-${index}`}
                      className="w-24 rounded-md bg-emerald-200 p-2 text-gray-800"
                      placeholder="Qty"
                      min={0}
                      value={sizes[size as Sizes]}
                      onChange={(e) =>
                        handleSizeChange(size, parseInt(e.target.value) || 0)
                      }
                    />
                  </div>
                ))}
              </div>

              {/* Total Cost */}
              <div className="mt-4 flex items-center justify-between text-lg font-bold text-white">
                <span>Total Cost:</span>
                <span>₹{bulkTotalCost}</span>
              </div>

              {/* Buy Button */}
              <div className="mt-6 text-center">
                {merchData[0] && (
                  <BuyButton
                    merch={Object.entries(sizes)
                      .filter(([_, quantity]) => quantity > 0)
                      .map(([size, quantity]) => ({
                        id: tshirtData[0]?.id ?? "",
                        quantity: quantity,
                        size: size as Sizes,
                      }))}
                    total={bulkTotalCost}
                    className="rounded-full bg-white px-6 py-2 font-bold tracking-wide text-black lg:px-8 lg:py-3"
                  />
                )}
              </div>
            </form>
          </div>
        </div>
      )}
      <Cart isLoading={cartLoading} cartItems={userCartData ?? []} />
    </main>
  );
}
