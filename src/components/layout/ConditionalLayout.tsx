"use client";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { AIAssistant } from "@/components/ai/AIAssistant";
import { SidebarProvider } from "@/context/SidebarContext";

// Pages that render without the sidebar shell
const NO_SHELL = ["/login", "/signup", "/onboarding"];

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const noShell = NO_SHELL.some(p => pathname.startsWith(p));

    if (noShell) {
        // Render full-screen without sidebar / padding
        return <>{children}</>;
    }

    return (
        <SidebarProvider>
            <div className="flex min-h-screen">
                <Sidebar />
                <div className="flex-1">
                    <main className="p-4 md:p-10 lg:p-16 px-6 md:px-12 lg:px-24 pt-12 md:pt-20 pb-32 w-full max-w-[1500px] mx-auto">
                        <div className="flex flex-col items-center gap-12 md:gap-20 animate-fade-in pb-32 px-4 w-full">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
            <AIAssistant />
        </SidebarProvider>
    );
}
