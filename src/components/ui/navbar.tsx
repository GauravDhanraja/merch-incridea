"use client";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import ToggleMute from "./toggle-mute";
import Link from "next/link";
import { signIn } from 'next-auth/react';


const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Tshirt", href: "/tshirt" },
    { label: "Keychain", href: "/keychain" },
    { label: "Magnet", href: "/magnet" },
  ];

  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  return (
    <nav className="sticky top-0 z-50 w-screen border-b border-neutral-700/80 bg-neutral-900 py-3 backdrop-blur-lg">
      <div className="container relative mx-auto px-4 lg:text-sm">
        <div className="flex items-center justify-between">
          <div className="flex flex-shrink-0 items-center">
            <Image
              className="mr-2"
              src="/logo.png"
              alt="Logo"
              width={100}
              height={40}
            />
          </div>
          <ul className="hidden items-center justify-center space-x-12 text-xl font-extralight text-white lg:flex">
          <ul className="hidden items-center justify-center space-x-12 text-xl font-extralight text-white lg:flex">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
          <div className="hidden lg:flex justify-center space-x-12 items-center" onClick={()=>signIn('google')}>
            <a

              className="py-2 px-3 border border-white text-white rounded-md hover:bg-white hover:text-black"
            >
              Sign In
            </a>
          </div>

          <div className="flex flex-row gap-4 lg:hidden">
          <ToggleMute/>
            <button
              onClick={toggleNavbar}
              aria-label={mobileDrawerOpen ? "Close menu" : "Open menu"}
              className="text-white focus:outline-none"
            >
              {mobileDrawerOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {mobileDrawerOpen && (
          <div className="fixed right-0 z-20 flex h-svh w-full flex-col items-center border-b border-neutral-700/80 bg-neutral-900 lg:hidden">
            <ul className="m-2 flex flex-col">
          <div className="fixed right-0 z-20 flex h-svh w-full flex-col items-center border-b border-neutral-700/80 bg-neutral-900 lg:hidden">
            <ul className="m-2 flex flex-col">
              {navItems.map((item, index) => (
                <li
                  key={index}
                  className="py-10 text-center text-4xl font-bold text-white"
                >
                <li
                  key={index}
                  className="py-10 text-center text-4xl font-bold text-white"
                >
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex">
              <a
                href="#"
                className="rounded-md border border-white px-4 py-2 text-white hover:bg-white hover:text-black"
              >
                Sign In
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
