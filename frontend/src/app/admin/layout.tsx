"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Loading from "@/components/ui/Loading";
import AdminNavbar from "@/components/admin/shared/AdminNavbar";
import AdminSidebar from "@/components/admin/shared/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const { user, loading } = useAuth();

    const isLogin = pathname === "/admin/login";

    useEffect(() => {
        if (loading || isLogin) return;
        if (!user) {
            router.replace("/admin/login");
            return;
        }
        if (user.role !== "admin") {
            router.replace("/");
        }
    }, [user, loading, isLogin, router]);

    // Avoid any UI render until auth check resolves (prevents flash)
    if (isLogin) return <div className="min-h-screen">{children}</div>;
    if (loading) return <Loading />; // or a tiny spinner

    // If not admin, early return null while redirect kicks in
    if (!user || user.role !== "admin") return null;

    return (
        <div className="w-full h-auto bg-[#f5f6fa] flex flex-col">
            <AdminNavbar />
            <div className="flex flex-1 relative">
                <AdminSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
                <main className={`flex-1 px-6 py-6 transition-all duration-300 mt-[70px] ${isCollapsed ? "ml-20" : "ml-68"}`}>
                    <div className="bg-white shadow-sm rounded-xl p-6 min-h-[calc(100vh-120px)]">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}