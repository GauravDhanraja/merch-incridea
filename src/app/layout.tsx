import "~/styles/globals.css";
import { type Metadata } from "next";
import { TRPCReactProvider } from "~/trpc/react";
import Navbar from "~/components/ui/navbar";
import { MusicProvider } from "~/components/ui/MusicContext";
import { SessionProvider } from "next-auth/react";
import TransitionWrapper from "~/components/ui/loader";

export const metadata: Metadata = {
  title: "Incridea Merch",
  description: "One Stop Shopping (hopefully)",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="flex max-h-screen flex-col">
        <TransitionWrapper>
          <SessionProvider>
            <MusicProvider>
              <Navbar />
              <TRPCReactProvider>{children}</TRPCReactProvider>
            </MusicProvider>
          </SessionProvider>
        </TransitionWrapper>
      </body>
    </html>
  );
}
