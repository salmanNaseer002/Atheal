"use client";

import { User as FirebaseUser, UserCredential } from "firebase/auth";
import { UserProfile } from "@/types";
import { createGenericContext } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  onAuthStateChangedHandler,
  getDocument,
  createDocumentWithId,
  signUp,
  signIn,
  signOut,
} from "@/helper/firebase-helper";
import { signupSchema } from "@/schemas";
import { z } from "zod";
import { COLLECTIONS, ROLES } from "@/enums";

export interface AuthSessionContext {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  role: "admin" | "user" | null;
  status: "loading" | "authenticated" | "unauthenticated";
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signUp: (user: z.infer<typeof signupSchema>) => Promise<void>;
  signOut: () => Promise<void>;
}

const [_useAuthSessionContext, AuthSessionContextProvider] =
  createGenericContext<AuthSessionContext>();

export const AuthSessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<"admin" | "user" | null>(null);
  const [status, setStatus] = useState<
    "loading" | "authenticated" | "unauthenticated"
  >("loading");

  useEffect(() => {
    const unsubscribe = onAuthStateChangedHandler(async (user) => {
      console.log(user);
      try {
        if (user) {
          setUser(user);
          setStatus("loading");

          const profile = await getDocument<UserProfile>("users", user.uid);
          if (!profile) {
            throw new Error("User profile not found");
          }

          setProfile(profile);
          setRole(profile.role);
          setStatus("authenticated");
        } else {
          setUser(null);
          setProfile(null);
          setRole(null);
          setStatus("unauthenticated");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setStatus("unauthenticated");
        setUser(null);
        setProfile(null);
        setRole(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const userSignUp = async (user: z.infer<typeof signupSchema>) => {
    const userCredential = await signUp(user.email, user.password);
    await createDocumentWithId(COLLECTIONS.USERS, userCredential.user.uid, {
      ...user,
      bio: "",
      photoURL: "",
      role: ROLES.USER,
    });
  };

  return (
    <AuthSessionContextProvider
      value={{
        user,
        profile,
        status,
        role,
        signIn,
        signUp: userSignUp,
        signOut,
      }}
    >
      {children}
    </AuthSessionContextProvider>
  );
};

const useAuthSessionContext = () => {
  const context = _useAuthSessionContext();
  if (context === undefined) {
    throw new Error(
      "useAuthSessionContext must be used within a AuthSessionProvider"
    );
  }
  return context;
};

export default useAuthSessionContext;
