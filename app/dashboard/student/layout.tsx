"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, TrendingUp, Calendar, LogOut } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import AiChatWidget from "@/components/AiChatWidget";

const navItems = [
  { href: "/dashboard/student", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/student/classes", label: "My Classes", icon: BookOpen },
  { href: "/dashboard/student/progress", label: "Progress", icon: TrendingUp },
  { href: "/dashboard/student/schedule", label: "Schedule", icon: Calendar },
];

export default function StudentDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-white shadow-sm">
        <div className="p-6 border-b">
          <Link href="/" className="text-xl font-black text-[#033D8B]">Knoveryx</Link>
          <p className="text-xs text-gray-500 mt-1 font-medium uppercase tracking-widest">Student Portal</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon, exact }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                isActive(href, exact)
                  ? "bg-[#033D8B] text-white shadow-md shadow-blue-900/20"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t flex items-center justify-between">
          <UserButton afterSignOutUrl="/" />
          <Link href="/" className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
            <LogOut className="w-3 h-3" /> Home
          </Link>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-lg font-black text-[#033D8B]">Knoveryx</Link>
        <div className="flex items-center gap-3">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t flex">
        {navItems.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center py-2 gap-1 text-[10px] font-bold transition-colors ${
              isActive(href, exact) ? "text-[#033D8B]" : "text-gray-400"
            }`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-14 md:pt-0 pb-16 md:pb-0">
        {children}
      </main>

      <AiChatWidget role="student" />
    </div>
  );
}
