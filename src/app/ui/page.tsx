"use client";
import React, { useState } from "react";

function Home() {
  const [count, setCount] = useState(0);
  const [size, setSize] = useState("S");
  const [selectedItem, setSelectedItem] = useState("T");
  const [price, setPrice] = useState(100);

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
    <div className="flex h-full w-screen justify-center md:h-screen md:items-center bg-white">
      <div className="flex flex-col w-full h-full bg-neutral-900 p-4 md:rounded-3xl md:h-[90vh] md:w-[90vw] md:flex-row md:justify-between">
      <div className="flex flex-col w-full h-[60vh] md:h-full md:w-1/3">
        <div className="flex h-full w-full rounded-2xl bg-neutral-400/40 mb-2"></div>
        <div className="flex h-1/6 w-full flex-col rounded-2xl bg-neutral-400/40"></div>
        </div>
        <div className="flex flex-col w-full items-center justify-center md:w-2/3 md:flex-row">
          <div className="m-10 flex flex-col w-full md:w-1/2">
          <div className="md:mb-32">
            <p className="text-4xl md:text-6xl font-extralight text-white md:mb-6">Merch 1</p>
            <p className="text-2xl my-2 md:text-4xl font-extralight text-white">
              ${price.toPrecision(5)}
            </p>
            </div>
            <div className="flex h-full w-full flex-col justify-center">
            <div className="flex flex-row justify-center-center gap-2 md:flex-col">
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
                    if (count >= 0) setCount(count + 1);
                  }}
                >
                  +
                </div>
              </div>
              </div>
              <div className="mt-8 h-16 w-full cursor-pointer select-none rounded-2xl bg-neutral-400/40 py-5 text-center text-neutral-200">
                Add to Cart
              </div>
            </div>
          </div>
          <div className="m-4 flex h-auto md:h-full w-full flex-col rounded-xl scrollable p-8 bg-neutral-800 text-white md:mx-2 md:w-1/2">
          <p className="text-lg md:text-xl  text-neutral-400">
              Premium Graphic T-Shirt Style that Speaks to You! Make a statement
              with our [Your Design Name] T-Shirt, crafted for those who love to
              wear their passion. Made with 100% soft, breathable cotton, this
              tee ensures all-day comfort without compromising on durability.
              Features: Bold Design: High-quality, fade-resistant prints that
              stand out. Unmatched Comfort: Lightweight fabric with a relaxed
              fit for everyday wear. Eco-Friendly Materials: Sustainably sourced
              cotton for guilt-free style. Perfect for Any Occasion: Casual
              outings, workouts, or lounging at home. Available in a variety of
              colors and sizes (S to 3XL), this t-shirt is perfect for everyone.
              Pair it with your favorite jeans, shorts, or joggers for an
              effortlessly cool look. Why You’ll Love It: Stylish and Versatile
              Durable and Long-Lasting Designed with You in Mind Get yours today
              and turn heads wherever you go!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

