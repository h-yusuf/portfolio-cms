"use client";
import { Bell, Search, PlusCircle, UserCircle } from "lucide-react";

export default function Navbar() {
  return (
    <header className="h-16 px-6 border-b border-base-300 flex items-center bg-base-200 justify-between sticky top-0 z-30">
      <h1 className="text-xl font-semibold text-gray-800">

      </h1>

      <div className="flex items-center gap-4">
        <div className="relative w-64 hidden md:block me-12">
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-info-content"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        </div>
  
        <Bell className="w-5 h-5 text-gray-600 hover:text-info-content cursor-pointer" />
        <UserCircle className="w-7 h-7 text-gray-500 cursor-pointer" />
      </div>
    </header>
  );
}
