import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import { api } from "~/trpc/react";

export default async function Home() {
  // const hello = await api.post.hello({ text: "from tRPC" });
  const session = await auth();

  // if (session?.user) {
  //   void api.post.getLatest.prefetch();
  // }
  const merchandise = await api.merchandise.getAllMerch.useQuery().data;
  const purchaseMerch = await api.merchandise.purchaseMerch.useMutation();
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Merch <span className="text-[hsl(280,100%,70%)]">Incridea</span>
          </h1>

          {/* copy the below component wherever you want to display the merchandise */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-8">
            {merchandise?.map((merch) => (
              <div
                key={merch.id}
                className="flex flex-col items-center justify-center gap-2 rounded-lg bg-white/10 p-4 text-center"
              >
                <img
                  src={merch?.image}
                  alt={merch?.name}
                  className="h-48 w-full rounded-lg object-cover"
                />
                <h2 className="text-2xl font-semibold">{merch.name}</h2>
                <p className="w-full truncate rounded-3xl bg-white/20 py-1 text-lg">
                  {merch.description}
                </p>
                <p className="w-full rounded-3xl bg-white/20 py-1 text-lg">
                  {merch.available ? (
                    <p className="text-green-500">Available</p>
                  ) : (
                    <p className="text-red-700">Sold out</p>
                  )}
                </p>
                <p className="w-full rounded-3xl bg-white/20 py-1 text-lg">
                  Stock: {merch?.stock}
                </p>
                <p className="flex gap-4 text-lg font-semibold">
                  <span className="text-red-500 line-through">
                    ₹{merch?.originalPrice}
                  </span>{" "}
                  ₹{merch?.discountPrice}
                </p>
                {/* razorpay yet to be added */}
                <button
                  className="w-full rounded-lg bg-red-500 py-2"
                  onClick={() => purchaseMerch.mutate({ merchId: merch.id })}
                >
                  Buy this Item
                </button>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-col items-center justify-center gap-4">
              <p className="text-center text-2xl text-white">
                {session && <span>Logged in as {session.user?.name}</span>}
              </p>
              <Link
                href={session ? "/api/auth/signout" : "/api/auth/signin"}
                className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
              >
                {session ? "Sign out" : "Sign in"}
              </Link>
            </div>
          </div>

          {/* {session?.user && <LatestPost />} */}
        </div>
      </main>
    </HydrateClient>
  );
}
