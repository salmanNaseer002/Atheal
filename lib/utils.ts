"use client";

import { clsx, type ClassValue } from "clsx";
import { createContext, useContext } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createGenericContext<T>() {
  const genericContext = createContext<T | undefined>(undefined);

  function useGenericContext() {
    const context = useContext(genericContext);
    if (context === undefined) {
      throw new Error("useContext must be used within a Provider");
    }
    return context;
  }

  return [useGenericContext, genericContext.Provider] as const;
}
