import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-12 w-full rounded-md border border-gray-200 bg-white px-4 py-2",
        "text-base outline-none transition-colors duration-200",

        "hover:border-gray-300",
        "focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20",

        "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500",

        "placeholder:text-gray-400",
        "selection:bg-blue-100 selection:text-blue-900",

        "file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0",
        "file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700",
        "hover:file:bg-blue-100",

        "aria-invalid:border-red-500 aria-invalid:ring-red-500/20",

        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };
