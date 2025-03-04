"use client";

import { useEffect } from "react";
import useAuthSessionContext from "../context/auth-session-context";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

const ROUTE_CONFIG = {
  admin: {
    defaultRoute: "/user-profiles",
    allowedRoutes: ["/user-profiles"],
  },
  user: {
    defaultRoute: "/profile",
    allowedRoutes: ["/profile"],
  },
} as const;

const AuthRedirection = ({ children }: { children: React.ReactNode }) => {
  const { status, role } = useAuthSessionContext();
  const router = useRouter();

  useEffect(() => {
    const currentPath = window.location.pathname;

    if (status === "unauthenticated") {
      const isProtectedRoute = Object.values(ROUTE_CONFIG).some((config) =>
        config.allowedRoutes.some((route) => currentPath.includes(route))
      );
      if (isProtectedRoute) {
        router.push("/login");
      }
    } else if (status === "authenticated" && role) {
      const userConfig = ROUTE_CONFIG[role as keyof typeof ROUTE_CONFIG];
      if (
        !userConfig.allowedRoutes.some((route) => currentPath.includes(route))
      ) {
        router.push(userConfig.defaultRoute);
      }
    }
  }, [status, role, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthRedirection;
