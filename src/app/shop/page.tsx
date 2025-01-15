"use client";

import { type Merchandise } from "@prisma/client";
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
  type Sizes = Record<string, number>;
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
  const [sizes, setSizes] = useState<Sizes>({});
  const [bulkTotalCost, setBulkTotalCost] = useState(0);
  const [bulkTotalQty, setBulkTotalQty] = useState(0);
  const [tshirtData, setTshirtData] = useState<Merchandise[]>([]);

  const { data: session } = useSession();

  const handleSizeChange = (size: string, quantity: number): void => {
    setSizes((prev: Sizes) => {
      const updatedSizes: Sizes = { ...prev, [size]: Math.max(0, quantity) };
      calculateBulkTotalCost(updatedSizes);
      return updatedSizes;
    });
  };

  const calculateBulkTotalCost = (updatedSizes: Sizes): void => {
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
      const tshirt = allMerchData.filter((item) => item.bulkOrder);
      setTshirtData(tshirt);
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
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-x-hidden bg-gradient-to-bl from-emerald-950 to-emerald-800 pt-24 md:overflow-y-hidden md:pt-20">
      {isLoading ? (
        <CircleLoader />
      ) : (
        <div className="flex min-h-screen w-full flex-col items-center justify-start space-y-8 p-4 pt-28 md:justify-center md:pt-6">
          <div className="flex flex-wrap justify-center gap-14">
            {/* Remaining merchandise */}
            <div className="flex flex-wrap justify-center gap-14">
              {merchData.map((item, index) =>
                item.bulkOrder ? (
                  <>
                    <div
                      key={item.id}
                      ref={(el) => {
                        if (el) cardRefs.current[0] = el;
                      }}
                      data-index={0}
                      onClick={() => setActiveCard(0)}
                      className={`relative cursor-pointer rounded-2xl p-4 shadow-lg transition-all duration-300 md:rounded-3xl md:p-6 ${
                        activeCard === 0
                          ? "h-[400px] w-72 scale-105 bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white md:h-[450px] md:w-80"
                          : "h-[350px] w-64 scale-95 bg-gradient-to-tr from-emerald-700 to-emerald-500 text-gray-300 md:h-[400px] md:w-72"
                      }`}
                    >
                      {activeCard === 0 && (
                        <button
                          className="absolute left-3 top-8 p-0 text-white hover:text-gray-200 md:left-4 md:top-10"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreviousCard();
                          }}
                        >
                          <FaChevronLeft size={24} />
                        </button>
                      )}
                      {activeCard === 0 && (
                        <button
                          className="absolute right-3 top-8 p-0 text-white hover:text-gray-200 md:right-4 md:top-10"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNextCard();
                          }}
                        >
                          <FaChevronRight size={24} />
                        </button>
                      )}
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 transform overflow-visible md:-top-16">
                        <div className="h-36 w-36 md:h-48 md:w-48">
                          <Image
                            src={item.image}
                            alt={item.name}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-full"
                          />
                        </div>
                      </div>
                      <div className="mt-24 text-center md:mt-28">
                        <h2
                          className={
                            activeCard === 0
                              ? "text-xl font-extrabold text-palate_1/90 md:text-2xl"
                              : "text-lg font-semibold text-palate_1/60 md:text-xl"
                          }
                        >
                          {item.name}
                        </h2>
                        <p
                          className={
                            activeCard === 0
                              ? "text-sm font-semibold text-palate_1/90 md:text-base"
                              : "text-xs font-normal text-palate_1/60 md:text-sm"
                          }
                        >
                          {item.description}
                        </p>
                        <p
                          className={
                            activeCard === 0
                              ? "text-lg font-extrabold text-palate_1/90 md:text-2xl"
                              : "text-base font-medium text-palate_1/60 md:text-lg"
                          }
                        >
                          ₹{item.discountPrice}
                        </p>
                        {activeCard === 0 && (
                          <div className="mt-6">
                            {session?.user.role === "CLASS_REP" ? (
                              <button
                                className="rounded-full bg-white px-6 py-2 font-bold tracking-wide text-black md:px-8 md:py-3"
                                onClick={() => setShowBulkOrderForm(true)}
                              >
                                Bulk Order
                              </button>
                            ) : (
                              <button
                                disabled
                                className="cursor-not-allowed rounded-full bg-white px-6 py-2 font-bold tracking-wide text-black md:px-8 md:py-3"
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
                      if (el) cardRefs.current[index + 1] = el;
                    }}
                    onClick={() => setActiveCard(index + 1)}
                    className={`relative cursor-pointer rounded-2xl p-4 shadow-lg transition-all duration-300 md:rounded-3xl md:p-6 ${
                      activeCard === index + 1
                        ? "h-[400px] w-72 scale-105 bg-gradient-to-tr from-emerald-700 to-emerald-500 text-white md:h-[450px] md:w-80"
                        : "h-[350px] w-64 scale-95 bg-gradient-to-tr from-emerald-800 to-emerald-600 text-gray-300 md:h-[400px] md:w-72"
                    }`}
                  >
                    {activeCard === index + 1 && (
                      <button
                        className="absolute left-3 top-8 p-0 text-white hover:text-gray-200 md:left-4 md:top-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePreviousCard();
                        }}
                      >
                        <FaChevronLeft size={24} color="white" />
                      </button>
                    )}
                    {activeCard === index + 1 && (
                      <button
                        className="absolute right-3 top-8 p-0 text-white hover:text-gray-200 md:right-4 md:top-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNextCard();
                        }}
                      >
                        <FaChevronRight size={24} color="white" />
                      </button>
                    )}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 transform overflow-visible md:-top-16">
                      <div className="h-36 w-36 md:h-48 md:w-48">
                        <Image
                          src={item.image}
                          alt={item.name}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-full"
                        />
                      </div>
                    </div>
                    <div className="mt-24 text-center md:mt-28">
                      <h2
                        className={
                          activeCard === index + 1
                            ? "text-xl font-extrabold text-palate_1/90 md:text-2xl"
                            : "text-lg font-semibold text-palate_1/60 md:text-xl"
                        }
                      >
                        {item.name}
                      </h2>
                      <p
                        className={
                          activeCard === index + 1
                            ? "text-sm font-semibold text-palate_1/90 md:text-base"
                            : "text-xs font-normal text-palate_1/60 md:text-sm"
                        }
                      >
                        {item.description}
                      </p>
                      <p
                        className={
                          activeCard === index + 1
                            ? "text-lg font-extrabold text-palate_1/90 md:text-2xl"
                            : "text-base font-medium text-palate_1/60 md:text-lg"
                        }
                      >
                        ₹{item.discountPrice}
                      </p>
                      <div
                        className={`mt-6 flex items-center justify-center gap-3 ${
                          activeCard !== index + 1 ? "hidden" : ""
                        }`}
                      >
                        <button
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-lg font-bold md:h-10 md:w-10 md:text-xl"
                          onClick={(e) => {
                            e.stopPropagation();
                            setMerchData((prev) =>
                              prev.map((prod, idx) =>
                                idx === index + 1
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
                        <span className="px-3 text-lg font-medium text-white md:px-4 md:text-xl">
                          {item.count}
                        </span>
                        <button
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-lg font-bold md:h-10 md:w-10 md:text-xl"
                          onClick={(e) => {
                            e.stopPropagation();
                            setMerchData((prev) =>
                              prev.map((prod, idx) =>
                                idx === index + 1
                                  ? { ...prod, count: prod.count + 1 }
                                  : prod,
                              ),
                            );
                          }}
                        >
                          <FaPlus className="text-gray-700" />
                        </button>
                      </div>
                      {activeCard === index + 1 && (
                        <div className="mt-4 flex flex-wrap justify-center gap-2 md:mt-6 md:gap-3">
                          <BuyButton
                            merch={[{ id: item.id, quantity: item.count }]}
                            total={item.discountPrice * item.count}
                            className="rounded-full bg-white px-6 py-2 font-bold tracking-wide text-black md:px-8 md:py-3"
                          />
                          {session?.user ? (
                            <button
                              className="rounded-full bg-white px-6 py-2 font-bold tracking-wide text-black md:px-8 md:py-3"
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
                            <button className="cursor-not-allowed rounded-full bg-white px-6 py-2 font-bold tracking-wide text-black md:px-8 md:py-3">
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
                {["Small", "Medium", "Large", "XL", "XXL"].map(
                  (size, index) => (
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
                        value={sizes[size]}
                        onChange={(e) =>
                          handleSizeChange(size, parseInt(e.target.value) || 0)
                        }
                      />
                    </div>
                  ),
                )}
              </div>

              {/* Total Cost */}
              <div className="mt-4 flex items-center justify-between text-lg font-bold text-white">
                <span>Total Cost:</span>
                <span>₹{bulkTotalCost}</span>
              </div>

              {/* Buy Button */}
              <div className="mt-6 text-center">
                {tshirtData[0] && (
                  <BuyButton
                    // name={name}          // Pass name state
                    // branch={branch}      // Pass branch state
                    // sem={semester}
                    // merch={[
                    //   {
                    //     id: tshirtData[0].id,
                    //     sizes: {
                    //       S: sizes.S ?? 0,
                    //       M: sizes.M ?? 0,
                    //       L: sizes.L ?? 0,
                    //       XL: sizes.XL ?? 0,
                    //       XXL: sizes.XXL ?? 0,
                    //     },
                    //   },
                    // ]}
                    merch={[{ id: tshirtData[0].id, quantity: bulkTotalQty }]}
                    total={tshirtData[0].discountPrice * bulkTotalQty}
                    className="rounded-full bg-white px-6 py-2 font-bold tracking-wide text-black md:px-8 md:py-3"
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
