"use client";

import { GoogleIcon } from "@/constants/icons.constants";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export const Social = () => {
  const router = useRouter();
  const handleGoogleLogin = async () => {
    router.push("/");
  };
  return (
    <div className="w-full">
      <div className="flex items-center w-full gap-x-4 mb-6">
        <div className="w-full h-[1px] bg-gray-300 rounded-full" />
        <div className="text-gray-500 text-nowrap text-xs font-medium">
          or continue with
        </div>
        <div className="w-full h-[1px] bg-gray-300 rounded-full" />
      </div>
      <div className="flex items-center gap-5 w-full">
        <Button
          className="w-full"
          variant="outline"
          onClick={handleGoogleLogin}
        >
          <div className="flex items-center justify-center gap-x-2 text-blue-500 font-medium">
            Continue with
            <GoogleIcon />
          </div>
        </Button>
      </div>
    </div>
  );
};
