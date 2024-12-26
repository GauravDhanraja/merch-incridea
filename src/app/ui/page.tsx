"use client";
import React from "react";
import Canvas from "../../components/ui/canvas";
import { useState } from "react";

function Home() {
   const [count,setCount]=useState(0)
   const [size,setSize]=useState("S")
 
   const handleSizeChange=()=>{
    if(size==="S")
      setSize("M")
    else if(size==="M")
      setSize("L")
    else if(size==="L")
      setSize("XL")
    else if(size==="XL")
      setSize("S") 
   }

  return (
    <div className="p-0 m-0">
      {/* Main Container */}
      <div className="my-7 lg:m-10 rounded-3xl min-h-screen bg-neutral-800 flex flex-col lg:flex-row">
        {/* Left Panel for Canvas */}
        <div className="flex justify-center items-center w-full lg:w-1/3 h-50 lg:auto">
          <Canvas />
        </div>
        <div className="flex justify-center items-center lg:items-start lg:flex-none">
          <div className="flex flex-row lg:flex-col bg-white p-5 w-[90%] max-w-[300px] h-auto m-5 gap-2 rounded-3xl">
               <button className="bg-black p-3 flex-grow h-[50px] rounded-3xl"></button>
               <button className="bg-black p-3 flex-grow h-[50px] rounded-3xl"></button>
               <button className="bg-black p-3 flex-grow h-[50px] rounded-3xl"></button>
           </div>
        </div>
        {/* Right Panel for Controls */}
        <div className="flex flex-col items-center justify-center w-full lg:w-2/3 gap-6 p-4">
          <div className="flex flex-col items-center justify-center">
            {/* Controls Section */}
            <div className="flex flex-row items-center justify-center w-full gap-4 p-4">
              {/* Size Selection */}
              <div className="flex items-center px-4 py-3 mx-2 rounded-3xl bg-white w-full max-w-sm justify-between">
                <div className="font-bold text-lg text-black mx-4">{size}</div>
                <button className="font-bold text-lg text-white bg-black px-4 py-2 rounded-full" onClick={handleSizeChange}>^</button>
              </div>

              {/* Quantity Control */}
              <div className="flex items-center px-4 py-3 mx-2 rounded-3xl bg-white w-full max-w-sm justify-between">
                <button className="font-bold text-lg text-white bg-black px-4 py-2 rounded-full"  onClick={()=>{setCount(count-1)}}>-</button>
                <div className="font-bold text-lg text-black mx-4">{count}</div>
                <button className="font-bold text-lg text-white bg-black px-4 py-2 rounded-full" onClick={()=>{setCount(count+1)}}>+</button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button className="font-bold text-black bg-white px-8 py-4 rounded-3xl hover:scale-110 transition-transform duration-150">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
