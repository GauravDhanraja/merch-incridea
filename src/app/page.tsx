"use client";
import { useSession } from "next-auth/react"; 
import { api } from "~/trpc/react"; 
import RenderModel from "~/app/testing3d/RenderModel";
import { TShirt } from "~/app/testing3d/models/TShirt";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession(); 
  const { data: latestPost, isLoading } = api.post.getLatest.useQuery(); 

  return (
    <main className="flex h-screen w-screen flex-col overflow-x-hidden bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="flex h-full w-screen flex-col items-center p-3 md:flex-row md:justify-center md:p-8">
        <div className="order-1 flex h-[60vh] w-screen px-3 md:order-2 md:h-full md:min-w-[90vh] md:px-0">
          <div className="relative h-full w-full flex-col rounded-3xl bg-white/50 shadow-xl shadow-black/30 backdrop-blur-xl">
            <div className="relative flex h-full w-full overflow-hidden rounded-3xl">
              <RenderModel>
                <TShirt />
              </RenderModel>
            </div>
          </div>
        </div>

        <div className="flex h-fit w-fit flex-col mt-8 md:mt-0 md:gap-14 justify-center md:p-24 order-2 md:order-1">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Merch <span className="text-[hsl(280,100%,70%)]">Incridea</span>
          </h1>
          <p className="md:block md:text-md md:mr-16 md:text-2xl">
            Celebrate the spirit of Nitte Incridea with our exclusive custom
            merchandise. Perfect for showcasing your love for the event or
            gifting to fellow enthusiasts.
          </p>

          <div className="flex items-center justify-center md:justify-normal">
            <div className="my-8 md:my-12 flex justify-center items-center">
              <Link
                href="/tshirt"
                className="rounded-md border border-white bg-white px-8 py-3 text-xl font-bold text-black hover:bg-purple-600 hover:text-white md:px-12 md:py-6 md:text-3xl transition ease-in-out duration-500 transform hover:scale-110"
              >
                Buy Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
