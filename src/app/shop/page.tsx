"use client";
import React, { useEffect, useState } from "react";
import CircleLoader from "~/components/ui/loader-circle-progress";
import Image from "next/image";
import PurchaseMerchButton from "~/components/ui/buyButton";
import { api } from "~/trpc/react";
import { FaMinus, FaPlus } from "react-icons/fa";
import BuyButton from "~/components/ui/buyButton";

function Home() {
  const [id1, setId1] = useState("");
  const [id2, setId2] = useState("");
  const [count1, setCount1] = useState(1);
  const [count2, setCount2] = useState(1);
  const [totalCount1, setTotalCount1] = useState(0);
  const [totalCount2, setTotalCount2] = useState(0);
  const [price1, setPrice1] = useState(0);
  const [price2, setPrice2] = useState(0);
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [description1, setDescription1] = useState("");
  const [description2, setDescription2] = useState("");
  const [priceWithFanumTax1, setPriceWithFanumTax1] = useState(0);
  const [priceWithFanumTax2, setPriceWithFanumTax2] = useState(0);
  const [imageLink1, setImageLink1] = useState("");
  const [imageLink2, setImageLink2] = useState("");

  const { data: merchData, isLoading } = api.merchandise.getAllMerch.useQuery();

  // Update price when data is fetched
  useEffect(() => {
    if (merchData) {
      setPrice1(merchData[0]!.discountPrice); // Assuming the API returns an array with a `price` field
      setPrice2(merchData[1]!.discountPrice); // Assuming the API returns an array with a `price` field
      setName1(merchData[0]!.name);
      setName2(merchData[1]!.name);
      setDescription1(merchData[0]!.description);
      setDescription2(merchData[1]!.description);
      setTotalCount1(merchData[0]!.stock);
      setTotalCount2(merchData[1]!.stock);
      setPriceWithFanumTax1(merchData[0]!.originalPrice);
      setPriceWithFanumTax2(merchData[1]!.originalPrice);
      setImageLink1(merchData[0]!.image);
      setImageLink2(merchData[1]!.image);
      setId1(merchData[0]!.id);
      setId2(merchData[1]!.id);
    }
  }, [merchData]);
  return (
    <main className="flex min-h-full w-screen flex-col">
      <div className="scrollable flex h-screen w-screen flex-col justify-between scroll-smooth bg-palate_2 pt-16 md:h-screen">
        <section id="2" className="snap-align-start">
          <div className="mx-auto my-8 flex w-[calc(100%-32px)] flex-col items-center gap-4 rounded-2xl bg-transparent md:w-[90vw] md:flex-row">
            <div className="flex w-full flex-row items-center rounded-xl bg-palate_1 p-2 shadow-md">
              {/* Image Section */}
              <div className="relative h-60 w-40 overflow-hidden rounded-lg shadow-md">
                {isLoading ? (
                  <CircleLoader />
                ) : (
                  <Image
                    src={imageLink1} // Replace with appropriate image source
                    alt={name1}
                    layout="fill"
                    objectFit="cover"
                    className="border-palette_2 rounded-lg border"
                  />
                )}
              </div>

              {/* Content Section */}
              <div className="ml-4 flex flex-1 flex-col">
                {isLoading ? (
                  <div className="loading-bar mb-4"></div>
                ) : (
                  <>
                    <p className="text-2xl font-bold text-black">{name1}</p>
                    <p className="text-xl font-bold text-gray-600">
                      <span className="text-red-600">₹{price1}</span>
                    </p>
                    <p className="mt-2 text-sm text-gray-500">{description1}</p>
                  </>
                )}
                <div className="mt-4 flex flex-row items-center justify-between">
                  <button
                    className="w-full items-center rounded-lg bg-white/20 px-4 py-2 font-bold text-white"
                    onClick={() => {
                      if (count1 > 1 && count1 <= totalCount1)
                        setCount1(count1 - 1);
                    }} // Replace with your buy function
                  >
                    <FaMinus className="mx-auto text-palate_2" />
                  </button>
                  <div className="font-lg w-full text-center">{count1}</div>
                  <button
                    className="w-full items-center rounded-lg bg-white/20 px-4 py-2 font-bold text-white"
                    onClick={() => {
                      if (count1 > 0 && count1 < totalCount1)
                        setCount1(count1 + 1);
                    }} // Replace with your buy function
                  >
                    <FaPlus className="mx-auto text-palate_2" />
                  </button>
                </div>
                <BuyButton merchId={id1} merchQuantity={count1}/>
              </div>
            </div>
            <div className="flex w-full flex-row items-center rounded-xl bg-palate_1 p-2 shadow-md">
              {/* Image Section */}
              <div className="relative h-60 w-40 overflow-hidden rounded-lg shadow-md">
                {isLoading ? (
                  <CircleLoader />
                ) : (
                  <Image
                    src={imageLink2} // Replace with appropriate image source
                    alt={name2}
                    layout="fill"
                    objectFit="cover"
                    className="border-palette_2 rounded-lg border"
                  />
                )}
              </div>

              {/* Content Section */}
              <div className="ml-4 flex flex-1 flex-col">
                {isLoading ? (
                  <div className="loading-bar mb-4"></div>
                ) : (
                  <>
                    <p className="text-2xl font-bold text-black">{name2}</p>
                    <p className="text-xl font-bold text-gray-600">
                      <span className="text-red-600">₹{price2}</span>
                    </p>
                    <div className="scrollable h-4">
                      <p className="text-sm text-gray-500">{description2}</p>
                    </div>
                  </>
                )}
                <div className="mt-4 flex flex-row items-center justify-between">
                  <button
                    className="w-full items-center rounded-lg bg-white/20 px-4 py-2 font-bold text-white"
                    onClick={() => {
                      if (count2 > 1 && count2 <= totalCount2)
                        setCount2(count2 - 1);
                    }} // Replace with your buy function
                  >
                    <FaMinus className="mx-auto text-palate_2" />
                  </button>
                  <div className="font-lg w-full text-center">{count2}</div>
                  <button
                    className="w-full items-center rounded-lg bg-white/20 px-4 py-2 font-bold text-white"
                    onClick={() => {
                      if (count2 > 0 && count2 < totalCount2)
                        setCount2(count2 + 1);
                    }} // Replace with your buy function
                  >
                    <FaPlus className="mx-auto text-palate_2" />
                  </button>
                </div>
                <BuyButton merchId={id2} merchQuantity={count2}/>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto flex w-[calc(100vw-32px)] flex-col rounded-t-2xl bg-palate_1 p-4 shadow-2xl md:h-[15vh] md:w-[90vw] md:flex-row md:justify-between">
          <p className="m-4 text-4xl font-black text-palate_2 text-text_1">
            Merch Incridea
          </p>
        </div>
      </div>
    </main>
  );
}

export default Home;
