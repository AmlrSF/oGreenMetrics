import React from 'react';
import { Bell, UserCircle } from 'lucide-react';

const Navbar = () => {
  return (
    <div className="flex h-16 bg-white shadow-sm">
      <div className="flex flex-grow items-center justify-end px-6">
        <div className="flex items-center gap-4">
          <button className="relative rounded-full p-2 hover:bg-gray-100">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
          </button>
          
          <div className="flex items-center gap-3 rounded-full border px-4 py-2">
            <UserCircle size={24} className="text-[#8EBE21]" />
            <span className="hidden sm:inline text-sm font-medium text-gray-700">Admin User</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;