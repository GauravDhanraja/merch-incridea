"use client";
import React, { useState } from "react";
import Canvas from "../../components/ui/canvas";

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

    const priceMap: Record<ItemType, number> = {
      T: 100,
      K: 200,
      F: 300,
    };

    setPrice(priceMap[item]);
  };

  const descriptionMap: Record<ItemType, string> = {
    T: "This is a trendy T-shirt, perfect for casual wear.",
    K: "Stay cozy with this premium hoodie, a wardrobe essential.",
    F: "Fashion meets comfort with this fantastic sweatshirt.",
  };

  return (
    <div className="p-0 m-0">
      {/* Main Container */}
      <div className="my-7 lg:m-10 rounded-3xl min-h-screen bg-neutral-800 flex flex-col lg:flex-row">
        {/* Left Panel for Canvas */}
        <div className="flex justify-center items-center w-full lg:w-1/3 h-50 lg:auto">
          <Canvas />
        </div>

        {/* Buttons Panel */}
        <div className="flex justify-center items-center lg:items-start lg:flex-none">
          <div className="flex flex-row lg:flex-col bg-white p-5 w-[90%] max-w-[300px] h-auto m-5 gap-2 rounded-3xl">
            <button
              className={`bg-black p-3 flex-grow h-[50px] rounded-3xl text-white ${
                selectedItem === "T" ? "border-2 border-yellow-500" : ""
              }`}
              onClick={() => handleItemChange("T")}
            >
              T
            </button>
            <button
              className={`bg-black p-3 flex-grow h-[50px] rounded-3xl text-white ${
                selectedItem === "K" ? "border-2 border-yellow-500" : ""
              }`}
              onClick={() => handleItemChange("K")}
            >
              K
            </button>
            <button
              className={`bg-black p-3 flex-grow h-[50px] rounded-3xl text-white ${
                selectedItem === "F" ? "border-2 border-yellow-500" : ""
              }`}
              onClick={() => handleItemChange("F")}
            >
              F
            </button>
          </div>
        </div>

        {/* Merch Price and Description */}
        <div className="m-5">
          <p className="font-extrabold text-xl lg:text-2xl text-white">
            Merch Price: ₹{price}
          </p>
          <p className="font-bold text-lg lg:text-2xl text-gray-300 mt-3">
            {descriptionMap[selectedItem]}
          </p>
        </div>

        {/* Right Panel for Controls */}
        <div className="flex flex-col items-center justify-center w-full lg:w-2/3 gap-6 p-4">
          <div className="flex flex-col items-center justify-center">
            {/* Controls Section */}
            <div className="flex flex-row items-center justify-center w-full gap-4 p-4">
              {selectedItem === "T" && (
                <div className="flex items-center px-4 py-3 mx-2 rounded-3xl bg-white w-full max-w-sm justify-between lg:px-8 lg:py-6">
                  <div className="font-bold text-lg text-black mx-4">{size}</div>
                  <button
                    className="font-bold text-lg text-white bg-black px-4 py-2 rounded-full"
                    onClick={handleSizeChange}
                  >
                    ^
                  </button>
                </div>
              )}

              {/* Quantity Control */}
              <div
                className={`flex items-center px-4 py-3 mx-2 rounded-3xl bg-white w-full max-w-sm justify-between lg:px-8 lg:py-6 ${
                  selectedItem !== "T" ? "mx-auto" : ""
                }`}
              >
                <button
                  className="font-bold text-lg text-white bg-black px-4 py-2 rounded-full"
                  onClick={() => {
                    if (count > 0) setCount(count - 1);
                  }}
                >
                  -
                </button>
                <div className="font-bold text-lg text-black mx-4">{count}</div>
                <button
                  className="font-bold text-lg text-white bg-black px-4 py-2 rounded-full"
                  onClick={() => setCount(count + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button className="font-bold text-black bg-white px-8 py-4 rounded-3xl hover:scale-110 transition-transform duration-150 lg:px-8 lg:py-6">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

