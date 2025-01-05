"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TShirt } from "~/components/3D/TShirt";
import RenderModel from "~/components/3D/RenderModel";
import { useMusic } from "~/components/ui/MusicContext"; // Import the useMusic hook
import { useSession } from "next-auth/react"; // Import the useSession hook for getting the user's session
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
      <div className="z-20 h-screen w-screen">
        <RenderModel>
          <TShirt playAudio={isMusicPlaying} />
          {/* Pass music state to TShirt */}
        </RenderModel>
      </div>
    </main>
  );
}
