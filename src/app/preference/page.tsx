"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return undefined;
}

export default function Preference() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user has already interacted and has cookies set
    const hasInteractedCookie = getCookie("hasInteracted");

    if (hasInteractedCookie === "true") {
      // Redirect to `/` immediately if cookies are present
      router.push("/");
    } else {
      // Allow rendering if cookies are not present
      setIsLoading(false);
    }
  }, [router]);

  const handleMusicChoice = (play: boolean) => {
    document.cookie = "hasInteracted=true; path=/; max-age=31536000"; // Set the interaction cookie for 1 year
    document.cookie = `isMusicPlaying=${play}; path=/; max-age=31536000`; // Set the music choice cookie for 1 year
    router.push("/"); // Redirect to home
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
