"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Home,
  FileText,
  Folder,
  Tag,
  Briefcase,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: <Home size={20} /> },
  { name: "Posts", href: "/admin/posts", icon: <FileText size={20} /> },
  { name: "Categories", href: "/admin/categories", icon: <Tag size={20} /> },
  { name: "Projects", href: "/admin/projects", icon: <Folder size={20} /> },
  { name: "Experiences", href: "/admin/experiences", icon: <Briefcase size={20} /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } bg-base-200 border-r border-base-300 min-h-screen transition-all duration-300 p-4`}
    >
      <div className="flex justify-between items-center mb-6 text-gray-600">
        {!collapsed && <span className="text-xl font-bold">Admin</span>}
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="p-1 rounded hover:bg-gray-100"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex flex-col gap-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                isActive
                  ? "bg-info-content text-white"
                  : "hover:bg-gray-100 text-gray-700 "
              }`}
            >
              {item.icon}
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
