"use client";
import RenderModel from "~/app/testing3d/RenderModel";
import { FridgeMagnet } from "~/app/testing3d/models/FridgeMagnet";
import { atom } from "jotai";
import { TShirt } from "~/app/testing3d/models/TShirt";
import { KeyChain } from "~/app/testing3d/models/KeyChain";

export const wiggleAtom = atom(true);

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-between">
      {/*<Image src={bg} alt="background-image" fill*/}
      {/*       className="-z-50 w-full h-full object-cover object-center opacity-25"></Image>*/}
      <div className="h-screen w-screen">
        {/*navigation and 3D model*/}

      </div>
    </main>
  );
}
