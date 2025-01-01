"use client";
import React, { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import Image from "next/image";

import RenderModel from "~/app/testing3d/RenderModel";
import { FridgeMagnet } from "~/app/testing3d/models/FridgeMagnet";
import { TShirt } from "~/app/testing3d/models/TShirt";

function Home() {
  const [count, setCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [size, setSize] = useState("S");
  const [selectedItem, setSelectedItem] = useState("T");
  const [price, setPrice] = useState(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priceWithFanumTax, setPriceWithFanumTax] = useState(0);
  const [imageLink, setImageLink] = useState("");

  const {
    data: merchData,
    isLoading,
    isError,
  } = api.merchandise.getAllMerch.useQuery();

  // Update price when data is fetched
  useEffect(() => {
    if (merchData) {
      setPrice(merchData[1].discountPrice); // Assuming the API returns an array with a `price` field
      setName(merchData[1].name);
      setDescription(merchData[1].description);
      setTotalCount(merchData[1].stock);
      setPriceWithFanumTax(merchData[1].originalPrice);
      setImageLink(merchData[1].image);
    }
  }, [merchData]);

  const handleSizeChange = () => {
    if (size === "S") setSize("M");
    else if (size === "M") setSize("L");
    else if (size === "L") setSize("XL");
    else if (size === "XL") setSize("S");
  };

  type ItemType = "T" | "K" | "F";

  const handleItemChange = (item: ItemType) => {
    setSelectedItem(item);
    setCount(0);

    if (item === "T") setPrice(100);
    else if (item === "K") setPrice(200);
    else if (item === "F") setPrice(300);
  };

  return (
    <div className="flex h-full w-screen flex-col overflow-x-hidden">
      <div className="flex h-full w-screen flex-col justify-center bg-white md:h-screen md:items-center">
        <div className="flex h-full w-full flex-col bg-neutral-900 p-4 shadow-xl shadow-black/30 md:h-[90vh] md:w-[90vw] md:flex-row md:justify-between md:rounded-3xl">
          <div className="flex h-[60vh] w-full flex-col md:h-full md:w-1/3">
            <div className="relative mb-2 flex h-5/6 w-full overflow-hidden rounded-2xl bg-neutral-400/40">
              <Image
                src={imageLink}
                alt={name}
                layout="fill" // This makes the image fill the parent container
                objectFit="cover" // This ensures the image covers the entire area
                className="rounded-2xl" // Optional: to keep the rounded corners
              />
            </div>
            <div className="flex h-1/6 w-full flex-col rounded-2xl bg-neutral-400/40"></div>
          </div>
          <div className="flex w-full flex-col items-center justify-center md:w-2/3 md:flex-row">
            <div className="m-10 flex h-4/6 w-full flex-col md:w-1/2">
              <div className="md:mb-32">
                <p className="text-4xl font-extralight text-white md:mb-6 md:text-6xl">
                  {name}
                </p>
                {isLoading ? (
                  <p className="text-neutral-400">Loading...</p>
                ) : isError ? (
                  <p className="text-red-500">Failed to load merchandise</p>
                ) : (
                  <p className="my-2 text-2xl font-extralight text-white md:text-4xl">
                    <del className="text-blue-400/30">
                      ${priceWithFanumTax}{" "}
                    </del>
                    ${price}
                  </p>
                )}
              </div>
              <div className="flex h-full w-full flex-col justify-center">
                <div className="flex flex-row justify-center gap-2 md:flex-col">
                  <div className="my-1 flex h-16 w-full flex-row items-center justify-between rounded-2xl bg-neutral-400/40 p-1">
                    <div className="mx-auto text-neutral-100">{size}</div>
                    <div
                      className="h-full w-3/4 cursor-pointer select-none rounded-xl bg-neutral-900 py-4 text-center text-neutral-400"
                      onClick={handleSizeChange}
                    >
                      Change Size
                    </div>
                  </div>
                  <div className="my-1 flex h-16 w-full flex-row items-center justify-between rounded-2xl bg-neutral-400/40 p-1">
                    <div
                      className="h-full w-1/3 cursor-pointer select-none rounded-xl bg-neutral-900 py-4 text-center text-neutral-400"
                      onClick={() => {
                        if (count > 0) setCount(count - 1);
                      }}
                    >
                      -
                    </div>
                    <div className="text-neutral-200">{count}</div>
                    <div
                      className="h-full w-1/3 cursor-pointer select-none rounded-xl bg-neutral-900 py-4 text-center text-neutral-400"
                      onClick={() => {
                        if (count >= 0 && count < totalCount)
                          setCount(count + 1);
                      }}
                    >
                      +
                    </div>
                  </div>
                </div>
                <div className="mt-8 h-16 w-full cursor-pointer select-none justify-center rounded-2xl bg-neutral-400/40 py-5 text-center text-neutral-200">
                  Add to Cart
                </div>
              </div>
            </div>
            <div className="scrollable m-4 flex h-4/6 w-full flex-col rounded-xl bg-neutral-800 p-4 text-white md:w-1/2 md:bg-neutral-900">
              <p className="text-lg text-neutral-400 md:text-xl">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
