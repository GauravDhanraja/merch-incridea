import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import { AppSidebar } from "~/components/AppSidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="h-full min-h-screen w-full bg-[#06040b]">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
