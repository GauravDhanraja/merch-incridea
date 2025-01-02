"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Create MusicContext with updated types
const MusicContext = createContext<{
  isMusicPlaying: boolean | undefined;
  setMusicPreference: (play: boolean) => void;
  toggleMusic: () => void;
} | null>(null);

// MusicProvider to manage state and preferences
export const MusicProvider = ({ children }: { children: ReactNode }) => {
  // Set the initial state to `undefined` if the cookie is not found
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean | undefined>(
    () => {
      const cookie = getCookie("isMusicPlaying");
      return cookie === undefined ? undefined : cookie === "true";
    },
  );

  // Update cookie whenever `isMusicPlaying` changes
  useEffect(() => {
    if (isMusicPlaying !== undefined) {
      setCookie("isMusicPlaying", isMusicPlaying.toString(), 7);
    }
  }, [isMusicPlaying]);

  // Function to set the music preference explicitly (from user interaction)
  const setMusicPreference = (play: boolean) => {
    setIsMusicPlaying(play);
  };

  // Function to toggle the current music state
  const toggleMusic = () => {
    setIsMusicPlaying((prev) => (prev === undefined ? true : !prev)); // Toggle between true/false or default to true if undefined
  };

  return (
    <MusicContext.Provider
      value={{ isMusicPlaying, setMusicPreference, toggleMusic }}
    >
      {children}
    </MusicContext.Provider>
  );
};

// Custom hook to use music context
export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
};

// Cookie helpers
function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return undefined; // Return `undefined` if the cookie is not found
}

function setCookie(name: string, value: string, days: number) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
}
