"use client";

import { useRouter } from "next/navigation";

export const LoginButton = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/auth/login");
  };

  return (
    <span onClick={() => handleClick()} className=" cursor-pointer">
      {children}
    </span>
  );
};
