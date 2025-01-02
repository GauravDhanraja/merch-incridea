import Link from "next/link";
import { LatestPost } from "~/app/_components/post";
import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import { api } from "~/trpc/react";

export default async function Home() {
  //const hello = await api.post.hello({ text: "from tRPC" });
  const session = await auth();

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }
  //const merchandise = await api.merchandise.getAllMerch.useQuery().data;
  //const purchaseMerch = await api.merchandise.purchaseMerch.useMutation();
  return (
    <HydrateClient>
      <main className="flex flex-col h-svh w-screen md:flex-row overflow-x-hidden bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white md:h-screen">
      <div className="flex flex-col h-full w-screen items-center md:justify-center p-3 md:p-8 md:flex-row">
        <div className="flex h-[60vh] w-screen px-3 md:px-0 md:h-full md:min-w-[90vh] order-1 md:order-2">
          <div className="relative h-full w-full flex-col rounded-3xl bg-white/50 shadow-xl shadow-black/30 backdrop-blur-xl">
            <div className="relative flex h-full w-full overflow-hidden rounded-3xl"></div>
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
              <a
                href="/tshirt"
                className="rounded-md border border-white bg-white px-8 py-3 text-xl font-bold text-black hover:bg-purple-600 hover:text-white md:px-12 md:py-6 md:text-3xl transition ease-in-out duration-500 transform hover:scale-110"
              >
                Buy now
              </a>
            </div>
          </div>
        </div>
        </div>
      </main>
    </HydrateClient>
  );
}
