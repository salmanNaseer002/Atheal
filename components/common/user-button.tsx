"use client";

import { Button } from "../ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User, Settings, LogOut } from "lucide-react";
import useAuthSessionContext from "@/lib/context/auth-session-context";

export const UserButton = () => {
  const { signOut, profile } = useAuthSessionContext();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
            <AvatarImage
              src={profile?.photoURL || ""}
              alt={`${profile?.firstName} ${profile?.lastName}` || "User"}
              className="object-cover"
            />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {profile?.firstName?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mt-2" align="end">
        <div className="px-2 py-1.5 text-sm font-medium text-gray-900">
          {`${profile?.firstName} ${profile?.lastName}` || "Guest User"}
          <div className="text-xs font-normal text-gray-500">
            {profile?.email || "guest@example.com"}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="gap-2 py-2">
          <Link href="/profile">
            <User size={16} />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="gap-2 py-2">
          <Link href="/settings">
            <Settings size={16} />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-2 py-2 text-red-600 focus:text-red-600 cursor-pointer"
          onClick={() => {
            signOut();
          }}
        >
          <LogOut size={16} />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
