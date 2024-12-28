"use client";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

   const navItems = [
    { label: "Home", href: "#" },
    { label: "Shop", href: "#" },
    { label: "Cart", href: "#" },
  ];

  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  return (
    <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg border-b border-neutral-700/80 bg-neutral-900">
      <div className="container px-4 mx-auto relative lg:text-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center flex-shrink-0">
            <Image
              className="h-10 w-10 mr-2"
              src=""
              alt="Logo"
              width={40}
              height={40}
            />
            <span className="text-xl tracking-tight text-white">Incridea Merch</span>
          </div>
          <ul className="hidden font-bold text-xl text-white lg:flex items-center justify-center space-x-12">
            {navItems.map((item, index) => (
              <li key={index}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
          <div className="hidden lg:flex justify-center space-x-12 items-center">
            <a
              href="#"
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
          <div className="fixed right-0 z-20 bg-neutral-900 w-full p-12 flex flex-col justify-center items-center lg:hidden">
            <ul>
              {navItems.map((item, index) => (
                <li key={index} className="font-bold text-white py-4">
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
            <div className="flex space-x-6">
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

