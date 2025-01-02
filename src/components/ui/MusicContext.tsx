"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

const MusicContext = createContext<{
  isMusicPlaying: boolean | undefined;
  toggleMusic: () => void;
  setMusicPreference: (play: boolean) => void;
} | null>(null);

export const MusicProvider = ({ children }: { children: ReactNode }) => {
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean | undefined>(
    () => {
      if (typeof window !== "undefined") {
        const cookie = getCookie("isMusicPlaying");
        return cookie ? cookie === "true" : undefined;
      }
      return undefined; // Default for SSR
    },
  );

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && isMusicPlaying !== undefined) {
      setCookie("isMusicPlaying", isMusicPlaying.toString(), 7);
    }
  }, [isMusicPlaying]);

  const setMusicPreference = (play: boolean) => {
    setIsMusicPlaying(play);
  };

  const toggleMusic = () => {
    if (isMusicPlaying !== undefined) {
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  // Wait until client-side rendering to render the content
  if (!isMounted) {
    return null; // Don't render anything until mounted
  }

  return (
    <MusicContext.Provider
      value={{ isMusicPlaying, toggleMusic, setMusicPreference }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
};

// Cookie helpers
function getCookie(name: string) {
  if (typeof document === "undefined") return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return undefined;
}

function setCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
}
