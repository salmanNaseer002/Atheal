"use client";

import * as z from "zod";
import CardWrapper from "../common/card-wrapper";
import { Form } from "@/components/ui/form";
import { signupSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import { InputField } from "../common/input-field";
import { Button } from "../ui/button";
import { FormError } from "../common/form-error";
import useAuthSessionContext from "@/lib/context/auth-session-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleAuthError } from "@/lib/helpers/error-handler";
import { Loader2 } from "lucide-react";

export const SignupForm = () => {
  const { signUp } = useAuthSessionContext();
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const { handleSubmit } = form;
  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    try {
      await signUp(values);
    } catch (error) {
      const { message } = handleAuthError(error);
      form.setError("root", { message });
    }
  };

  return (
    <CardWrapper
      headerLabel="Create an account"
      backButtonLabel="Already have an account?"
      backButtonHref="/login"
      // showSocial
    >
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormError message={form.formState.errors.root?.message} />
          <InputField
            label=""
            name="firstName"
            placeholder="Enter your first name"
            type="text"
          />
          <InputField
            label=""
            name="lastName"
            placeholder="Enter your last name"
            type="text"
          />
          <InputField
            label=""
            name="email"
            placeholder="Enter your email address"
            type="email"
          />
          <InputField
            label=""
            name="password"
            placeholder="Enter your password"
            type="password"
          />
          <Button
            type="submit"
            className="w-full mt-4 cursor-pointer"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
