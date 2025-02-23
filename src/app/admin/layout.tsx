import { auth } from "~/server/auth";
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session?.user && session?.user?.role === "ADMIN") {
    return <main className="h-screen w-full bg-[#06040b]">{children}</main>;
  }
  return (
    <main className="flex h-full min-h-screen w-full flex-col items-center justify-center gap-4 bg-[#06040b]">
      <h1 className="font-sans text-8xl font-bold text-white">404</h1>
      <h2 className="font-sans text-3xl font-bold text-white">
        Page not Found
      </h2>
    </main>
  );
}
