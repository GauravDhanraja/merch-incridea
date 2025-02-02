"use client";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import ToggleMute from "./toggle-mute";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const { data: session } = useSession();
  const mobileDrawerRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Team", href: "/team" },
  ];

  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      mobileDrawerRef.current &&
      !mobileDrawerRef.current.contains(event.target as Node)
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

  const navbarBgClass = pathname === "/" ? "bg-black/90" : "bg-palate_2/0";
  const navbarFgClass =
    pathname === "/" ? "text-palate_1/90" : "text-palate_1/90"; // Replace `bg-palate_2/90` with your desired color for other routes.

  return (
    <nav
      className={`fixed z-50 mx-4 mt-[16px] grid w-[calc(100%-32px)] rounded-2xl md:mx-[5%] md:w-[90%] ${navbarBgClass} py-2 ${pathname === "/admin" ? "hidden" : ""}`}
    >
      <div className="container relative mx-auto px-4 lg:text-sm">
        <div className="flex items-center justify-between">
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
          <ul
            className={`hidden select-none items-center space-x-12 text-xl font-bold md:flex ${navbarFgClass}`}
          >
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
            {/* Profile link */}
            {session && (
              <li>
                <Link href="/profile" className="text-xl font-bold">
                  Profile
                </Link>
              </li>
            )}
            {/* Admin Dashboard link */}
            {session?.user.role === "ADMIN" && (
              <li>
                <Link href="/admin">Admin</Link>
              </li>
            )}
          </ul>

          {/* Desktop Actions */}
          <div className="hidden items-center space-x-4 md:flex">
            <ToggleMute color={navbarFgClass} />
            {session ? (
              <button
                className={`rounded-md border border-[${navbarFgClass.substring(5)}] px-3 py-2 ${navbarFgClass} hover:bg-black hover:text-white`}
                onClick={() => signOut()}
              >
                Sign Out
              </button>
            ) : (
              <button
                className={`rounded-md border border-[${navbarFgClass.substring(5)}] px-3 py-2 ${navbarFgClass} hover:bg-black hover:text-white`}
                onClick={() => signIn("google")}
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center justify-center gap-3 md:hidden">
            <ToggleMute color={navbarFgClass} />
            <button
              onClick={toggleNavbar}
              aria-label={mobileDrawerOpen ? "Close menu" : "Open menu"}
              className={`${navbarFgClass} focus:outline-none`}
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
          className={`fixed bottom-0 right-0 z-50 mx-auto flex h-[80vh] w-[100vw] flex-col bg-palate_2 items-center rounded-t-3xl ${navbarBgClass} transition-opacity duration-500 ease-in-out lg:hidden ${
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
              <li
                key={item.href}
                className={`text-4xl font-bold ${navbarFgClass}`}
              >
                <Link href={item.href} onClick={toggleNavbar}>
                  {item.label}
                </Link>
              </li>
            ))}
            {/* Profile link */}
            {session && (
              <li className={`text-4xl font-bold ${navbarFgClass}`}>
                <Link href="/profile" onClick={toggleNavbar}>
                  Profile
                </Link>
              </li>
            )}
            {/* Admin Dashboard link */}
            {session?.user.role === "ADMIN" && (
              <li className={`text-4xl font-bold ${navbarFgClass}`}>
                <Link href="/admin" onClick={toggleNavbar}>
                  Admin
                </Link>
              </li>
            )}
          </ul>
          <div
            className={`my-16 transition-transform duration-500 ease-out ${
              mobileDrawerOpen ? "translate-y-0" : "translate-y-8"
            }`}
          >
            {session ? (
              <button
                className={`rounded-md border border-[${navbarFgClass.substring(5)}] ${navbarFgClass} px-6 py-4 text-4xl font-bold hover:bg-palate_1 hover:text-black`}
                onClick={() => signOut()}
              >
                Sign Out
              </button>
            ) : (
              <button
                className={`rounded-md border border-[${navbarFgClass.substring(5)}] ${navbarFgClass} px-6 py-4 text-4xl font-bold hover:bg-palate_1 hover:text-black`}
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
