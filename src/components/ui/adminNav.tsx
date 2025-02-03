import { Sheet, SheetTrigger, SheetContent } from "../ui/sheet";
import { Button } from "../ui/button";
import Link from "next/link";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Profile", path: "/profile" },
  { name: "Shop", path: "/shop" },
  { name: "Team", path: "/team" },
];

export default function AdminNav() {
  return (
    <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6 bg-black-900 text-white text-black-900">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden bg-white  text-black-900 ">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-gray-900 text-white ">
          <Link href="/" className="mr-6 hidden lg:flex" prefetch={false}>
            <MountainIcon className="h-6 w-6" />
            <span className="sr-only">Acme Inc</span>
          </Link>
          <div className="grid gap-2 py-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className="flex w-full items-center py-2 text-lg font-semibold text-black-700"
                prefetch={false}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </SheetContent>
      </Sheet>
      <Link href="/" className="mr-6 hidden lg:flex" prefetch={false}>
        <MountainIcon className="h-6 w-6" />
        <span className="sr-only">Acme Inc</span>
      </Link>
      <nav className="ml-auto hidden lg:flex gap-6">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-gray-800 text-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-700 hover:text-gray-300 focus:bg-gray-700 focus:text-gray-300 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-300 dark:hover:text-gray-800 dark:focus:bg-gray-300 dark:focus:text-gray-800"
            prefetch={false}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </header>
  );
}

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function MountainIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}
