"use client";

import { Card } from "@/components/ui/card";
import useAuthSessionContext from "@/lib/context/auth-session-context";
import { User, Users } from "lucide-react";
import Link from "next/link";

export default function UserNavigationSection() {
  const { role } = useAuthSessionContext();

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center items-center h-screen">
      <div className="max-w-md mx-auto">
        {role === "admin" ? (
          <Link href="/user-profiles">
            <Card className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer">
              <div className="flex items-center gap-4">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <h2 className="text-xl font-semibold">User Directory</h2>
                  <p className="text-gray-600">
                    Manage and view all user profiles
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        ) : (
          <Link href={`/profiles`}>
            <Card className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer">
              <div className="flex items-center gap-4">
                <User className="h-8 w-8 text-blue-600" />
                <div>
                  <h2 className="text-xl font-semibold">My Profile</h2>
                  <p className="text-gray-600">View and edit your profile</p>
                </div>
              </div>
            </Card>
          </Link>
        )}
      </div>
    </div>
  );
}
