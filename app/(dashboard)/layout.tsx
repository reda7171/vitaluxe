"use client";

import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import { Sidebar } from "../../components/dashboard/Sidebar";
import { Header } from "../../components/dashboard/Header";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <SessionProvider>
            <div className="flex h-screen bg-slate-50 overflow-hidden print:h-auto print:overflow-visible print:bg-white print:block">
                <div className="print:hidden">
                    <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                </div>
                <div className="flex flex-col flex-1 min-w-0 overflow-hidden print:overflow-visible print:block">
                    <div className="print:hidden">
                        <Header onMenuClick={() => setIsSidebarOpen(true)} />
                    </div>
                    <main className="flex-1 overflow-y-auto p-4 lg:p-6 overflow-x-hidden print:overflow-visible print:p-0 print:m-0 print:block">
                        {children}
                    </main>
                </div>
            </div>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 xl:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </SessionProvider>
    );
}
