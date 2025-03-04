import React from "react";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

interface HeaderProps {
  label: string;
}
const Header = ({ label }: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-2 justify-center">
      <div className="border border-gray-200 w-20 p-3 text-center text-gray-500 rounded-md">
        Logo
      </div>
      <h1
        className={cn(
          "text-3xl font-semibold text-gray-900 drop-shadow-sm mt-3",
          font.className
        )}
      >
        {label}
      </h1>
    </div>
  );
};

export default Header;
