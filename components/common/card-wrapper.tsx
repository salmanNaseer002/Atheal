"use client";

import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import BackButton from "./back-button";
import Header from "./auth-header";
import { Social } from "../common/social";
import { CardWrapperProps } from "@/types";

const CardWrapper = ({
  children,
  headerLabel,
  backButtonHref,
  backButtonLabel,
  showSocial,
}: CardWrapperProps) => {
  return (
    <Card className="w-full max-w-md border border-gray-200 bg-white rounded-2xl transition-all duration-300 shadow-none">
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent className="space-y-6 px-6">{children}</CardContent>
      {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}
      <CardFooter className="flex justify-center">
        <BackButton
          label={backButtonLabel}
          href={backButtonHref}
          variant="link"
          className="hover:text-blue-600 font-semibold"
        />
      </CardFooter>
    </Card>
  );
};

export default CardWrapper;
