"use client";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import ToggleMute from "./toggle-mute";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import Link from "next/link";

const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const { data: session } = useSession();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Keychain", href: "/keychain" },
    { label: "Magnet", href: "/magnet" },
  ];

  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  return (
    <nav className="sticky top-0 z-50 w-screen lg:border-b lg:border-neutral-700/80 bg-neutral-900 py-3 backdrop-blur-lg">
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
          <ul className="hidden items-center space-x-12 text-xl font-extralight text-white lg:flex">
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
                className="rounded-lg border border-white px-3 py-2 text-white hover:bg-white hover:text-black"
                onClick={() => signOut()}
              >
                Sign Out
              </button>
            ) : (
              <button
                className="rounded-lg border border-white px-3 py-2 text-white hover:bg-white hover:text-black"
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
              className="text-white focus:outline-none"
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
          className={`fixed right-0 top-0 z-20 flex h-svh w-full flex-col items-center justify-center bg-neutral-900 backdrop-blur-2xl transition-all duration-700 ease-in-out lg:hidden ${
            mobileDrawerOpen
              ? "pointer-events-auto translate-y-16 opacity-100 visible"
              : "pointer-events-none -translate-y-0 opacity-0 invisible"
          }`}
        >
          <ul
            className={`flex flex-col items-center space-y-16 transition-transform duration-500 ease-out ${
              mobileDrawerOpen ? "translate-y-0" : "-translate-y-8"
            }`}
          >
            {navItems.map((item) => (
              <li key={item.href} className="text-4xl font-bold text-white">
                <Link href={item.href} onClick={toggleNavbar}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div
            className={`my-16 transition-transform duration-700 ease-out ${
              mobileDrawerOpen ? "translate-y-0" : "translate-y-24"
            }`}
          >
            {session ? (
              <button
                className="rounded-lg border border-white px-6 py-4 text-white hover:bg-white hover:text-black"
                onClick={() => signOut()}
              >
                Sign Out
              </button>
            ) : (
              <button
                className="rounded-lg border border-white px-6 py-4 text-white hover:bg-white hover:text-black"
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
