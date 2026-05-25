// app/dashboard/tutor/layout.tsx
import Link from "next/link";
import { UserCircle, CalendarCheck } from "lucide-react";

export default function TutorLayout({ children }: { children: React.ReactNode }) {
  const menu = [
    { name: "Lessons", href: "/dashboard/tutor/lessons", icon: CalendarCheck },
    { name: "My Profile", href: "/dashboard/tutor/profile", icon: UserCircle },
  ];

  return (
    <div className="flex min-h-screen bg-white"> {/* Changed background for a cleaner feel */}
      <aside className="w-64 border-r bg-gray-50/50 p-6 hidden md:block sticky top-0 h-screen">
        <div className="mb-8 px-4">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tutor Panel</h2>
        </div>
        <nav className="space-y-2">
          {menu.map((item) => (
            <Link 
              key={item.name} 
              href={item.href} 
              className="flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 transition-all text-gray-700"
            >
              <item.icon size={20} className="text-[#ff6a97]" /> {/* Using your brand pink */}
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>
      
      {/* This 'main' needs to be flex-1 to occupy all remaining space */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}