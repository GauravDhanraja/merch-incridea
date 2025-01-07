"use client";

import { type Merchandise } from "@prisma/client";
import React, { useEffect, useState } from "react";
import CircleLoader from "~/components/ui/loader-circle-progress";
import { api } from "~/trpc/react";
import Image from "next/image";
import { FaMinus, FaPlus } from "react-icons/fa";
import BuyButton from "~/components/ui/buyButton";

export default function Shop() {
  const { data: allMerchData, isLoading } =
    api.merchandise.getAllMerch.useQuery();

  const [merchData, setMerchData] = useState<
    (Merchandise & { count: number })[]
  >([]);

  useEffect(() => {
    allMerchData?.map((it) => {
      setMerchData((prev) => {
        const index = prev.findIndex((item) => item.id === it.id);
        if (index === -1) {
          return [...prev, { ...it, count: 1 }];
        } else {
          return prev;
        }
      });
    });
  }, [allMerchData]);

  return (
    <main className="flex min-h-full w-screen flex-col">
      <div className="scrollable flex h-screen w-screen flex-col justify-between scroll-smooth bg-palate_2 pt-16 md:h-screen">
        <section id="2" className="snap-align-start">
          <div className="mx-auto my-8 flex w-[calc(100%-32px)] flex-col items-center gap-4 rounded-2xl bg-transparent md:w-[90vw] md:flex-row">
            {merchData.map((item, index) => (
              <div
                key={item.id}
                className="flex w-full flex-row items-center rounded-xl bg-palate_1 p-2 shadow-md"
              >
                <div className="relative h-60 w-40 overflow-hidden rounded-lg shadow-md">
                  {isLoading ? (
                    <CircleLoader />
                  ) : (
                    <Image
                      src={item.image}
                      alt={item.name}
                      layout="fill"
                      objectFit="cover"
                      className="border-palette_2 rounded-lg border"
                    />
                  )}
                </div>
                <div className="ml-4 flex flex-1 flex-col">
                  {isLoading ? (
                    <div className="loading-bar mb-4"></div>
                  ) : (
                    <>
                      <p className="text-2xl font-bold text-black">
                        {item.name}
                      </p>
                      <p className="text-xl font-bold text-gray-600">
                        <span className="text-red-600">
                          ₹{item.discountPrice}
                        </span>
                      </p>
                      <p className="mt-2 text-sm text-gray-500">
                        {item.description}
                      </p>
                    </>
                  )}
                  <div className="mt-4 flex flex-row items-center justify-between">
                    <button
                      className="w-full items-center rounded-lg bg-white/20 px-4 py-2 font-bold text-white"
                      onClick={() => {
                        setMerchData((prev) => {
                          const newCount = prev[index]!.count - 1;
                          if (newCount < 0) {
                            return prev;
                          }
                          const newMerchData = [...prev];
                          //@ts-expect-error nothing
                          newMerchData[index] = {
                            ...prev[index],
                            count: newCount,
                          };
                          return newMerchData;
                        });
                      }}
                    >
                      <FaMinus className="mx-auto text-palate_2" />
                    </button>
                    <div className="font-lg w-full text-center">
                      {item.count}
                    </div>
                    <button
                      className="w-full items-center rounded-lg bg-white/20 px-4 py-2 font-bold text-white"
                      onClick={() => {
                        setMerchData((prev) => {
                          const newCount = prev[index]!.count + 1;
                          const newMerchData = [...prev];
                          //@ts-expect-error nothing
                          newMerchData[index] = {
                            ...prev[index],
                            count: newCount,
                          };
                          return newMerchData;
                        });
                      }}
                    >
                      <FaPlus className="mx-auto text-palate_2" />
                    </button>
                  </div>
                  <BuyButton merchId={item.id} merchQuantity={item.count} />
                </div>
              </div>
            ))}
          </div>
        </section>
        <div className="mx-auto flex w-[calc(100vw-32px)] flex-col rounded-t-2xl bg-palate_1 p-4 shadow-2xl md:h-[15vh] md:w-[90vw] md:flex-row md:justify-between">
          <p className="m-4 text-4xl font-black text-palate_2">
            Merch Incridea
          </p>
        </div>
      </div>
    </main>
  );
}
