import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a0a] text-foreground selection:bg-white selection:text-black">
      {/* Sidebar */}
      <div className="hidden lg:block w-[17rem] shrink-0 p-4 pr-0">
        <Sidebar />
      </div>

      {/* Mobile nav */}
      <MobileNav />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto scrollbar-thin relative">
        {/* Subtle top-right ambient gradient */}
        <div className="pointer-events-none fixed top-0 right-0 w-[500px] h-[300px] bg-white/[0.012] blur-3xl rounded-full -translate-y-1/2 translate-x-1/4 z-0" />

        <div className="relative z-10 px-8 lg:px-12 pt-24 lg:pt-12 pb-16 max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
