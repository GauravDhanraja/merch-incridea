"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TShirt } from "~/app/testing3d/models/TShirt";
import RenderModel from "~/app/testing3d/RenderModel";
import { useMusic } from "~/components/ui/MusicContext"; // Import the useMusic hook
import { useSession, signIn } from "next-auth/react"; // Import the useSession hook for getting the user's session
import { SlArrowLeft, SlArrowRight, SlFrame } from "react-icons/sl";
import { api } from "~/trpc/react";

export default function HomePage() {
  const router = useRouter();
  const { isMusicPlaying } = useMusic(); // Use context for the music state
  const { data: session } = useSession(); // Use session to get user information

  const {
    data: merchData,
    isLoading,
    isError,
  } = api.merchandise.getAllMerch.useQuery();

  useEffect(() => {
    if (isMusicPlaying === undefined) {
      // Redirect to /preference if the music preference is not set
      router.push("/preference");
    }
  }, [router, isMusicPlaying]);

  // Display a loading state while cookies are being verified or the music preference is undefined
  if (isMusicPlaying === undefined) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    );
  }

  // Get the user's name from the session (if available)
  const userName = session?.user?.name ?? "Guest";

  return (
    <main className="flex h-screen w-screen flex-col overflow-hidden bg-neutral-900 text-white lg:h-screen lg:min-h-max lg:flex-row">
      <div className="flex h-full w-screen flex-col items-center p-0 lg:flex-row lg:justify-center lg:p-8">
        <div className="order-2 flex h-fit w-screen flex-col lg:order-2 lg:h-full lg:min-w-[90vh] lg:px-0">
          <div className="relative h-[25vh] w-full flex-col bg-gradient-to-b from-[#2e026d] to-[#15162c] backdrop-blur-xl">
            <div className="relative flex h-full w-full overflow-hidden rounded-3xl">
              <RenderModel>
                <TShirt playAudio={isMusicPlaying} />{" "}
                {/* Pass music state to TShirt */}
              </RenderModel>
            </div>
          </div>

          <div className="flex flex-row items-center justify-between p-4 border-b border-neutral-700/80">
            <button>
              <SlArrowLeft />
            </button>
            <button>
              <SlFrame />
            </button>
            <button>
              <SlArrowRight />
            </button>
          </div>
        </div>

        <div className="order-1 mt-4 flex h-fit w-fit flex-col items-center justify-center lg:order-1 lg:mt-8 lg:gap-14 lg:p-24">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-[5rem]">
            Merch <span className="text-[hsl(280,100%,70%)]">Incridea</span>
          </h1>
          <p className="p-6 text-center text-xs lg:mr-16 lg:text-2xl">
            Celebrate the spirit of Nitte Incridea with our exclusive custom
            merchandise. Perfect for showcasing your love for the event or
            gifting to fellow enthusiasts.
          </p>
        </div>

        <div
          className={`order-3 flex h-full w-full flex-col items-center justify-center p-3 lg:w-2/3 lg:flex-row ${userName === "Guest" ? "blur-sm" : ""}`}
        >
          <div className="flex h-full w-full flex-col lg:w-1/2">
            <div className="flex flex-row justify-between lg:mb-32">
              <p className="text-4xl font-extralight text-white lg:mb-6 lg:text-6xl">
                Tshirt
              </p>
              {isLoading ? (
                <p className="text-neutral-400">Loading...</p>
              ) : isError ? (
                <p className="text-red-500">Failed to load merchandise</p>
              ) : (
                <p className="my-2 text-2xl font-extralight text-white lg:text-4xl">
                  ₹799
                </p>
              )}
            </div>
            <div className="flex h-fit w-full flex-col mt-3 p-2 text-white lg:w-1/2 lg:bg-neutral-900">
              <p className="text-lg text-neutral-400 lg:text-xl">Incridea 2025 Tshirt</p>
            </div>
          </div>
        </div>

        {/* Display the user's name if logged in */}
        <div className="fixed bottom-4 z-10 w-full m-4 text-center text-xl font-bold text-white lg:text-4xl">
          <div className="flex items-center justify-center lg:my-12">
            {userName === "Guest" ? (
              <div>
                <p className="py-4">Sign in to buy merchandise</p>
                <button
                  className="transform rounded-lg border border-white bg-white px-8 py-3 text-xl font-bold text-black transition duration-500 ease-in-out hover:scale-110 hover:bg-purple-600 hover:text-white lg:px-12 lg:py-6 lg:text-3xl"
                  onClick={() => signIn("google")}
                >
                  Sign In
                </button>
              </div>
            ) : (
              <div className="rounded-lg bg-neutral-800 w-full mx-4 py-3 text-xl font-bold text-neutral-500 lg:px-12 lg:py-6 lgtext-3xl">
                Offine Purchase Only
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
