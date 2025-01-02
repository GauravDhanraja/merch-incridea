"use client";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
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
    <nav className="sticky top-0 z-50 py-3 w-screen backdrop-blur-lg border-b border-neutral-700/80 bg-neutral-900">
      <div className="container px-4 mx-auto relative lg:text-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center flex-shrink-0">
            <Image
                className="mr-2"
              src="/logo.png"
              alt="Logo"
              width={100}
              height={40}
            />
          </div>
          <ul className="hidden text-xl font-extralight text-white lg:flex items-center justify-center space-x-12">
            {navItems.map((item, index) => (
              <li key={index}>
                <a href={item.href}>{item.label}</a>
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

          <div className="lg:hidden">
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
          <div className="fixed right-0 z-20 bg-neutral-900 w-full h-svh flex flex-col items-center border-b border-neutral-700/80 lg:hidden">
            <ul className="flex flex-col m-2">
              {navItems.map((item, index) => (
                <li key={index} className="font-bold text-white text-center text-4xl py-10">
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
            <div className="flex mt-8">
              <a href="#" className="py-2 px-4 border border-white text-white rounded-md hover:bg-white hover:text-black">
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

