import React from "react";
import Link from "next/link";
import { UserButton } from "./user-button";

const Navbar = () => {
  return (
    <nav className="w-full border-b border-gray-200 bg-white backdrop-blur-md fixed top-0 z-50">
      <div className="container mx-auto h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <div className="border border-gray-200 p-2 rounded-md text-gray-500 font-medium">
            Atheal
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <UserButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
