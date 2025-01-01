"use client";
import React, { useEffect, useState } from "react";
import Navbar from "~/components/ui/navbar";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import Image from "next/image";

function Home() {
  const [count, setCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [size, setSize] = useState("S");
  const [selectedItem, setSelectedItem] = useState("T");
  const [price, setPrice] = useState(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priceWithFanumTax, setPriceWithFanumTax] = useState(0);
  const [imageLink, setImageLink] = useState([]);

  const {
    data: merchData,
    isLoading,
    isError,
  } = api.merchandise.getAllMerch.useQuery();

  // Update price when data is fetched
  useEffect(() => {
    if (merchData) {
      setPrice(merchData[0].discountPrice); // Assuming the API returns an array with a `price` field
      setName(merchData[0].name);
      setDescription(merchData[0].description);
      setTotalCount(merchData[0].stock);
      setPriceWithFanumTax(merchData[0].originalPrice);
      setImageLink([merchData[0].image,merchData[1].image,merchData[2].image]);
    }
  }, [merchData]);

  const router = useRouter();
  const images = [
    { src: imageLink[0], route: "/tshirt", alt: "Image 1" },
    { src: imageLink[1], route: "/magnet", alt: "Image 2" },
    { src: imageLink[2], route: "/keychain", alt: "Image 3" },
  ];

  const handleImageClick = (route: string) => {
    router.push(route);
  };

  return (
    <div className="flex h-screen w-screen flex-col">
      <div className="flex h-full w-screen flex-col justify-center bg-white md:h-screen md:items-center">
        <div className="flex h-full w-full flex-col bg-neutral-900 p-4 md:h-[90vh] md:w-[90vw] md:flex-row md:justify-between md:rounded-3xl">
          <div className="flex h-[60vh] w-full flex-col md:h-full md:w-1/3">
            <div className="relative mb-2 flex h-5/6 w-full overflow-hidden rounded-2xl bg-neutral-400/40">
              <Image
                src={imageLink[1]}
                alt={name}
                layout="fill" // This makes the image fill the parent container
                objectFit="cover" // This ensures the image covers the entire area
                className="rounded-2xl" // Optional: to keep the rounded corners
              />
            </div>
            <div className="flex h-1/6 w-full items-center justify-center rounded-2xl bg-neutral-400/40">
              {images.map((image, index) => (
                <div
                  key={index}
                  onClick={() => handleImageClick(image.route)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    style={{ width: "100px", height: "100px" }}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex w-full flex-col items-center justify-center md:w-2/3 md:flex-row">
            <div className="m-10 flex h-4/6 w-full flex-col md:w-1/2">
              <div className="md:mb-32">
                <p className="text-4xl font-extralight text-white md:mb-6 md:text-6xl">
                  {name}
                </p>
                <p className="my-2 text-2xl font-extralight text-white md:text-4xl">
                  <del className="text-blue-400/30">${priceWithFanumTax} </del>$
                  {price}
                </p>
              </div>
              <div className="flex h-full w-full flex-col justify-center">
                <div className="flex flex-row justify-center gap-2 md:flex-col">
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
                  Buy
                </div>
              </div>
            </div>
            <div className="scrollable m-4 flex h-4/6 w-full rounded-xl bg-neutral-800 p-4 text-white md:w-1/2 md:bg-neutral-900">
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
