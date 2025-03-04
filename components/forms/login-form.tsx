"use client";

import * as z from "zod";
import CardWrapper from "../common/card-wrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { loginSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import { InputField } from "../common/input-field";
import { Button } from "../ui/button";
import { FormError } from "../common/form-error";
import useAuthSessionContext from "@/lib/context/auth-session-context";
import { handleAuthError } from "@/lib/helpers/error-handler";
import { Loader2 } from "lucide-react";

export const LoginForm = () => {
  const { signIn } = useAuthSessionContext();
  const method = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { handleSubmit } = method;

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      await signIn(data.email, data.password);
    } catch (error) {
      const { message } = handleAuthError(error);
      method.setError("root", { message });
    }
  };
  return (
    <CardWrapper
      headerLabel="Sign in"
      backButtonLabel="Don't have an account?"
      backButtonHref="/signup"
      // showSocial
    >
      <Form {...method}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormError message={method.formState.errors.root?.message} />
          <InputField name="email" placeholder="Enter your email address" />
          <InputField
            name="password"
            type="password"
            placeholder="Enter your password"
          />

          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={method.formState.isSubmitting}
          >
            {method.formState.isSubmitting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
