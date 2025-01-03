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
          <ul className="hidden lg:flex items-center space-x-12 text-xl font-extralight text-white">
            {navItems.map((item) => (
              <li key={item.href}>

                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <ToggleMute />
            {session ? (
              <button
                className="rounded-md border border-white px-3 py-2 text-white hover:bg-white hover:text-black"
                onClick={() => signOut()}
              >
                Sign Out
              </button>
            ) : (
              <button
                className="rounded-md border border-white px-3 py-2 text-white hover:bg-white hover:text-black"
                onClick={() => signIn("google")}
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center">
            <ToggleMute />
            <button
              onClick={toggleNavbar}
              aria-label={mobileDrawerOpen ? "Close menu" : "Open menu"}
              className="text-white focus:outline-none"
            >
              {mobileDrawerOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileDrawerOpen && (
          <div className="fixed top-0 right-0 z-20 w-full h-full bg-neutral-900 border-b border-neutral-700/80 flex flex-col items-center lg:hidden">
            <ul className="flex flex-col items-center mt-16 space-y-6">
              {navItems.map((item) => (
                <li key={item.href} className="text-4xl font-bold text-white">
                  <Link href={item.href} onClick={toggleNavbar}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              {session ? (
                <button
                  className="rounded-md border border-white px-3 py-2 text-white hover:bg-white hover:text-black"
                  onClick={() => signOut()}
                >
                  Sign Out
                </button>
              ) : (
                <button
                  className="rounded-md border border-white px-3 py-2 text-white hover:bg-white hover:text-black"
                  onClick={() => signIn("google")}
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;


