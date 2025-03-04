"use client";

import { useEffect, useState } from "react";
import useAuthSessionContext from "../context/auth-session-context";
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

const PUBLIC_ROUTES = ["/login", "/signup"];

const AuthRedirection = ({ children }: { children: React.ReactNode }) => {
  const { status, role } = useAuthSessionContext();
  const [isReloading, setIsReloading] = useState(false);

  useEffect(() => {
    const currentPath = window.location.pathname;

    if (status === "unauthenticated") {
      if (!PUBLIC_ROUTES.includes(currentPath)) {
        window.location.href = "/login";
      }
    } else if (status === "authenticated" && role) {
      const userConfig = ROUTE_CONFIG[role as keyof typeof ROUTE_CONFIG];
      if (
        !userConfig.allowedRoutes.some((route) => currentPath.includes(route))
      ) {
        window.location.href = userConfig.defaultRoute;
      }
    }
  }, [status, role]);

  useEffect(() => {
    setIsReloading(false);

    const handleBeforeUnload = () => {
      setIsReloading(true);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  if (status === "loading" || isReloading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthRedirection;
