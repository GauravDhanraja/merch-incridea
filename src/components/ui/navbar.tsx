"use client";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ToggleMute from "./toggle-mute";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import Link from "next/link";

const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const { data: session } = useSession();
  const mobileDrawerRef = useRef(null);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Keychain", href: "/keychain" },
    { label: "Magnet", href: "/magnet" },
    { label: "Buy", href: "/buy" },
  ];

  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const handleClickOutside = (event) => {
    if (
      mobileDrawerRef.current &&
      !mobileDrawerRef.current.contains(event.target)
    ) {
      setMobileDrawerOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="fixed z-50 mx-auto ml-[20px] mr-[20px] mt-[20px] grid w-[calc(100%-40px)] rounded-full bg-palate_1/20 py-2 shadow-xl md:backdrop-blur-2xl">
      <div className="container relative mx-auto px-4 lg:text-sm">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Image
              className="mr-2"
              src="/logo.png"
              alt="Logo"
              width={100}
              height={40}
            />
          </div>

          {/* Desktop Nav */}
          <ul className="hidden select-none items-center space-x-12 text-xl font-bold text-black lg:flex">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>

          {/* Desktop Actions */}
          <div className="hidden items-center space-x-4 lg:flex">
            <ToggleMute />
            {session ? (
              <button
                className="rounded-md border border-black px-3 py-2 text-black hover:bg-black hover:text-white"
                onClick={() => signOut()}
              >
                Sign Out
              </button>
            ) : (
              <button
                className="rounded-md border border-black px-3 py-2 text-black hover:bg-black hover:text-white"
                onClick={() => signIn("google")}
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center justify-center gap-3 lg:hidden">
            <ToggleMute />
            <button
              onClick={toggleNavbar}
              aria-label={mobileDrawerOpen ? "Close menu" : "Open menu"}
              className="text-text_1 focus:outline-none"
            >
              {mobileDrawerOpen ? (
                <X className="size-8" />
              ) : (
                <Menu className="size-8" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <div
          ref={mobileDrawerRef}
          className={`fixed bottom-0 right-0 z-50 mx-auto flex h-[80vh] w-[100vw] flex-col items-center rounded-t-3xl bg-palate_1/50 transition-opacity duration-500 ease-in-out lg:hidden ${
            mobileDrawerOpen
              ? "opacity-100 backdrop-blur-2xl"
              : "pointer-events-none opacity-0"
          }`}
        >
          <ul
            className={`mt-16 flex transform flex-col items-center space-y-16 transition-transform duration-500 ease-out ${
              mobileDrawerOpen ? "translate-y-0" : "-translate-y-8"
            }`}
          >
            {navItems.map((item) => (
              <li key={item.href} className="text-4xl font-bold text-text_1">
                <Link href={item.href} onClick={toggleNavbar}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div
            className={`my-16 transition-transform duration-500 ease-out ${
              mobileDrawerOpen ? "translate-y-0" : "translate-y-8"
            }`}
          >
            {session ? (
              <button
                className="rounded-md border border-text_1 px-6 py-4 text-4xl font-bold text-text_1 hover:bg-white hover:text-black"
                onClick={() => signOut()}
              >
                Sign Out
              </button>
            ) : (
              <button
                className="rounded-lg border border-white px-6 py-4 text-white hover:bg-white hover:text-black"
                className="rounded-md border border-text_1 px-6 py-4 text-4xl font-bold text-text_1 hover:bg-white hover:text-black"
                onClick={() => signIn("google")}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
