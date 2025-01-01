"use client";
import React, { useState } from "react";
import Navbar from "~/components/ui/navbar";
import { useRouter } from 'next/navigation';

function Home() {
  const [count, setCount] = useState(0);
 
  const [selectedItem, setSelectedItem] = useState("T");
  const [price, setPrice] = useState(100);

const router = useRouter();
    const images = [
      { src: '', route: '/ui', alt: 'Image 1' },
      { src: '', route: '/magnet', alt: 'Image 2' },
      { src: '', route: '/keychain', alt: 'Image 3' },
    ];
  
    const handleImageClick = (route: string) => {
      router.push(route);
    };
  
  return (
    <div className="flex flex-col w-screen h-screen">
      <Navbar />
      <div className="flex h-full w-screen flex-col justify-center bg-white md:h-screen md:items-center">
        <div className="flex h-full w-full flex-col bg-neutral-900 p-4 md:h-[90vh] md:w-[90vw] md:flex-row md:justify-between md:rounded-3xl">
          <div className="flex h-[60vh] w-full flex-col md:h-full md:w-1/3">
            <div className="mb-2 flex h-full w-full rounded-2xl bg-neutral-400/40"></div>
            <div className="flex h-1/6 w-full items-center justify-center rounded-2xl bg-neutral-400/40">
             {images.map((image, index) => (
              <div key={index} onClick={() => handleImageClick(image.route)} style={{ cursor: 'pointer' }}>
                <img src={image.src} alt={image.alt} style={{ width: '100px', height: '100px' }} />
               </div>
               ))}
            </div>
          </div>
          <div className="flex w-full flex-col items-center justify-center md:w-2/3 md:flex-row">
            <div className="m-10 flex w-full h-4/6 flex-col md:w-1/2">
              <div className="md:mb-32">
                <p className="text-4xl font-extralight text-white md:mb-6 md:text-6xl">
                  Merch 1
                </p>
                <p className="my-2 text-2xl font-extralight text-white md:text-4xl">
                  ${price.toPrecision(5)}
                </p>
              </div>
              <div className="flex h-full w-full flex-col justify-center">
                <div className="justify-center flex flex-row gap-2 md:flex-col">
                  
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
                <div className="mt-8 h-16 w-full cursor-pointer select-none rounded-2xl bg-neutral-400/40 py-5 text-center justify-center text-neutral-200">
                  Add to Cart
                </div>
              </div>
            </div>
            <div className="scrollable m-4 flex h-4/6 w-full  rounded-xl bg-neutral-800 p-4 text-white md:w-1/2 md:bg-neutral-900">
              <p className="text-lg text-neutral-400 md:text-xl">
                Premium Graphic T-Shirt Style that Speaks to You! Make a
                statement with our [Your Design Name] T-Shirt, crafted for those
                who love to wear their passion. Made with 100% soft, breathable
                cotton, this tee ensures all-day comfort without compromising on
                durability. Features: Bold Design: High-quality, fade-resistant
                prints that stand out. Unmatched Comfort: Lightweight fabric
                with a relaxed fit for everyday wear. Eco-Friendly Materials:
                Sustainably sourced cotton for guilt-free style. Perfect for Any
                Occasion: Casual outings, workouts, or lounging at home.
                Available in a variety of colors and sizes (S to 3XL), this
                t-shirt is perfect for everyone. Pair it with your favorite
                jeans, shorts, or joggers for an effortlessly cool look. Why
                You’ll Love It: Stylish and Versatile Durable and Long-Lasting
                Designed with You in Mind Get yours today and turn heads
                wherever you go!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;