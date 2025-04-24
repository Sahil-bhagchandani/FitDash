import React from "react";
import { Bell } from "lucide-react";

const Navbar = () => {
  return (
    <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <div className="flex space-x-6 text-gray-600">
        <a href="#" className="hover:text-blue-500">Blogs</a>
        <a href="#" className="hover:text-blue-500">Pricing</a>
        <a href="#" className="hover:text-blue-500">Subscribe</a>
      </div>
      <Bell className="text-gray-600 hover:text-blue-500 cursor-pointer" />
    </header>
  );
};

export default Navbar;
