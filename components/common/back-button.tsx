"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

interface BackButtonProps {
  label: string;
  href: string;
  className?: string;
  variant?: "ghost" | "link";
}

const BackButton = ({
  label,
  href,
  className,
  variant = "ghost",
}: BackButtonProps) => {
  return (
    <Button
      variant={variant}
      className={`
        w-full text-xs text-gray-500 
        hover:text-blue-300/80 transition-colors 
        duration-200 font-medium
        ${className || ""}
      `}
      asChild
    >
      <Link
        href={href}
        className="flex items-center justify-end gap-2"
        aria-label={`Go back to ${label}`}
      >
        {label}
        <ArrowRight className="w-4 h-4" aria-hidden="true" />
      </Link>
    </Button>
  );
};

export default BackButton;
