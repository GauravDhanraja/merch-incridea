"use client";
import { GoUnmute, GoMute } from "react-icons/go";
import { useMusic } from "~/components/ui/MusicContext";

const ToggleMute = ({ color }: { color: string }) => {
  const { isMusicPlaying, toggleMusic } = useMusic();

  return (
    <div>
      {!isMusicPlaying ? (
        <GoMute
          className={`h-8 w-8 ${color} cursor-pointer`}
          onClick={toggleMusic}
        />
      ) : (
        <GoUnmute
          className={`h-8 w-8 ${color} cursor-pointer`}
          onClick={toggleMusic}
        />
      )}
    </div>
  );
};

export default ToggleMute;
