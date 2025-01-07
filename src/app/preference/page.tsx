"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMusic } from "~/components/ui/MusicContext"; // Import the context hook

export default function Preference() {
  const [isLoading, setIsLoading] = useState(false);
  const { isMusicPlaying, setMusicPreference } = useMusic(); // Use setMusicPreference instead of toggleMusic
  const router = useRouter();

  useEffect(() => {
    if (isMusicPlaying !== undefined) {
      // If the music preference is already set, redirect to the homepage
      setIsLoading(true);
      router.push("/");
    }
  }, [isMusicPlaying, router]);

  const handleMusicChoice = (play: boolean) => {
    // Set the cookie explicitly
    document.cookie = `isMusicPlaying=${play}; path=/; max-age=31536000`;

    // Use the context to update the preference
    setMusicPreference(play);

    // Redirect to the homepage
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-900 text-white">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-900 text-white">
      <div className="flex flex-col items-center text-center">
        <h1 className="mb-8 text-3xl font-bold">Welcome to Merch Incridea</h1>
        <p className="mb-6 text-lg">
          Would you like to enable music for your experience?
        </p>
        <div className="flex flex-col gap-4 md:flex-row">
          <button
            onClick={() => handleMusicChoice(true)}
            className="relative rounded bg-purple-600 px-6 py-3 text-white transition ease-in-out hover:bg-purple-700"
          >
            <span className="absolute inset-0 rounded border-4 border-transparent transition-all duration-300 ease-in-out hover:border-purple-400"></span>
            Yes, Play Music
          </button>
          <button
            onClick={() => handleMusicChoice(false)}
            className="relative rounded bg-gray-600 px-6 py-3 text-white transition ease-in-out hover:bg-gray-700"
          >
            <span className="absolute inset-0 rounded border-4 border-transparent transition-all duration-300 ease-in-out hover:border-gray-400"></span>
            No, Enter Without Music
          </button>
        </div>
      </div>
    </div>
  );
}
