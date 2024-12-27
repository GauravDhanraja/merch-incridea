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

  const handleItemChange = (item) => {
    setSelectedItem(item);
    setCount(0);

    if (item === "T") setPrice(100);
    else if (item === "K") setPrice(200);
    else if (item === "F") setPrice(300);
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-white">
      <div className="flex h-[90vh] w-[90vw] flex-col justify-between rounded-3xl bg-neutral-900 p-4 sm:flex-row">
        <div className="h-full w-1/3 rounded-2xl bg-neutral-400/40"></div>
        <div className="mx-2 my-auto flex h-1/2 w-1/12 flex-col rounded-2xl bg-neutral-400/40">
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="flex w-2/3 flex-row items-center justify-center">
          <div className="m-10 flex w-1/2 flex-col">
            <p className="text-6xl font-extralight text-white">Merch 1</p>
            <p className="my-2 text-2xl font-extralight text-white">
              ${price.toPrecision(5)}
            </p>
            <div className="flex h-full w-full flex-col justify-center">
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
              <div className="mt-8 h-16 w-full cursor-pointer select-none rounded-2xl bg-neutral-400/40 py-5 text-center text-neutral-200">
                Add to Cart
              </div>
            </div>
          </div>
          <div className="mx-2 my-12 flex h-1/2 w-1/2 flex-col overflow-y-auto rounded-xl p-4 scrollable">
            <p className="text-xl text-neutral-400">
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
