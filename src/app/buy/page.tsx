"use client";
import React, { useEffect, useState } from "react";
import CircleLoader from "~/components/ui/loader-circle-progress";
import Image from "next/image";
import PurchaseMerchButton from "~/components/ui/buyButton";
import { api } from "~/trpc/react";
import { FaMinus, FaPlus } from "react-icons/fa";

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

  const {
    data: merchData,
    isLoading,
  } = api.merchandise.getAllMerch.useQuery();

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
      <div className="scrollable h-full w-screen flex-col bg-palate_1 md:h-screen scroll-smooth snap-y snap-mandatory">
        <section id="1" className="snap-align-start">
          <div className="mx-auto -mt-10 mb-16 flex w-full flex-col bg-palate_2/90 p-4 pt-40 shadow-2xl md:h-[90vh] md:w-[90vw] md:flex-row md:justify-between rounded-3xl">
            <div className="flex h-[60vh] w-full flex-col md:h-full md:w-1/3">
              <div className="relative flex h-full w-full overflow-hidden rounded-2xl shadow-xl">
                {isLoading ? (
                  <CircleLoader />
                ) : (
                  <Image
                    src={imageLink1}
                    alt={name1}
                    layout="fill" // This makes the image fill the parent container
                    objectFit="cover" // This ensures the image covers the entire area
                    className="rounded-2xl" // Optional: to keep the rounded corners
                  />
                )}
              </div>
            </div>
            <div className="flex w-full flex-col items-center justify-center md:w-2/3 md:flex-row">
              <div className="m-10 flex h-4/6 w-full flex-col md:w-1/2">
                <div className="md:mb-32">
                  <>
                    {isLoading ? (
                      <div className="loading-bar mb-30"></div>
                    ) : (
                      <p className="select-none text-4xl font-bold text-text_1 md:mb-6 md:text-6xl">
                        {name1}
                      </p>
                    )}
                  </>
                  <>
                    {isLoading ? (
                      <div className="loading-bar mt-16"></div>
                    ) : (
                      <p className="my-2 select-none text-2xl text-text_1 md:text-4xl">
                        <del className="text-black/30">
                          ₹{priceWithFanumTax1}{" "}
                        </del>
                        ₹{price1}
                      </p>
                    )}
                  </>
                </div>
                <div className="flex h-full w-full flex-col justify-center">
                  <div className="flex flex-row justify-center gap-2 md:flex-col">
                    <div className="my-1 flex h-16 w-full flex-row items-center justify-between rounded-2xl bg-palate_1 p-1">
                      <button
                        className="h-full w-1/3 cursor-pointer select-none rounded-xl bg-palate_2 py-4 text-center font-black text-neutral-400 active:bg-white/80 active:text-black md:hover:bg-white/80 md:hover:text-black"
                        onClick={() => {
                          if (count1 > 0) setCount1(count1 - 1);
                        }}
                      >
                        <FaMinus className="mx-auto text-text_1" />
                      </button>
                      <div className="font-bold text-neutral-200">{count1}</div>
                      <button
                        className="h-full w-1/3 cursor-pointer select-none rounded-xl bg-palate_2 py-4 text-center font-bold text-neutral-400 active:bg-white/80 active:text-black md:hover:bg-white/80 md:hover:text-black"
                        onClick={() => {
                          if (count1 >= 0 && count1 < totalCount1)
                            setCount1(count1 + 1);
                        }}
                      >
                        <FaPlus className="mx-auto text-text_1" />
                      </button>
                    </div>
                  </div>
                  <PurchaseMerchButton merchId={id1} merchQuantity={count1} />
                </div>
              </div>
              <div className="scrollable m-4 flex h-4/6 w-full rounded-xl bg-palate_1 p-4 md:w-1/2">
                {isLoading ? (
                  <CircleLoader />
                ) : (
                  <p className="text-lg font-bold text-palate_2 md:text-xl">
                    {description1}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto -mt-10 mb-8 flex w-full flex-col bg-palate_2/90 p-4 shadow-2xl md:h-[70vh] md:w-[90vw] md:flex-row md:justify-between rounded-3xl">
          <div className="flex h-[60vh] w-full flex-col md:h-full md:w-1/3">
            <div className="relative flex h-full w-full overflow-hidden rounded-2xl shadow-xl">
              <section id="2" className="snap-align-center">
                {isLoading ? (
                  <CircleLoader />
                ) : (
                  <Image
                    src={imageLink2}
                    alt={name2}
                    layout="fill" // This makes the image fill the parent container
                    objectFit="cover" // This ensures the image covers the entire area
                    className="rounded-2xl shadow-2xl" // Optional: to keep the rounded corners
                  />
                )}
              </section>
            </div>
          </div>
          <div className="flex w-full flex-col items-center justify-center md:w-2/3 md:flex-row">
            <div className="m-10 flex h-4/6 w-full flex-col md:w-1/2">
              <div className="md:mb-32">
                <p className="text-4xl font-bold text-text_1 md:mb-6 md:text-6xl">
                  {isLoading ? <div className="loading-bar"></div> : name2}
                </p>
                <p className="my-2 text-2xl text-text_1 md:text-4xl">
                  <del className="text-black/30">₹{priceWithFanumTax2} </del>₹
                  {price2}
                </p>
              </div>
              <div className="flex h-full w-full flex-col justify-center">
                <div className="flex flex-row justify-center gap-2 md:flex-col">
                  <div className="my-1 flex h-16 w-full flex-row items-center justify-between rounded-2xl bg-palate_1 p-1">
                    <button
                      className="h-full w-1/3 cursor-pointer select-none rounded-xl bg-palate_2 py-4 text-center font-black text-neutral-400 active:bg-white/80 active:text-black md:hover:bg-white/80 md:hover:text-black"
                      onClick={() => {
                        if (count2 > 0) setCount2(count2 - 1);
                      }}
                    >
                      <FaMinus className="mx-auto text-text_1" />
                    </button>
                    <div className="font-bold text-neutral-200">{count2}</div>
                    <button
                      className="h-full w-1/3 cursor-pointer select-none rounded-xl bg-palate_2 py-4 text-center font-bold text-neutral-400 active:bg-white/80 active:text-black md:hover:bg-white/80 md:hover:text-black"
                      onClick={() => {
                        if (count2 >= 0 && count2 < totalCount2)
                          setCount2(count2 + 1);
                      }}
                    >
                      <FaPlus className="mx-auto text-text_1" />
                    </button>
                  </div>
                </div>
                <PurchaseMerchButton merchId={id2} merchQuantity={count2} />
              </div>
            </div>
            <div className="scrollable m-4 flex h-4/6 w-full rounded-xl bg-palate_1 p-4 text-white shadow-2xl md:w-1/2">
              <p className="text-lg font-bold text-palate_2 md:text-xl">
                {description2}
              </p>
            </div>
          </div>
        </div>
        <div className="mx-auto flex h-full w-full flex-col bg-palate_2/90 p-4 shadow-2xl md:h-[15vh] md:w-[90vw] md:flex-row md:justify-between rounded-t-3xl">
          <p className="m-4 text-7xl font-black text-text_1">Merch Incridea</p>
        </div>
      </div>
    </main>
  );
}

export default Home;
