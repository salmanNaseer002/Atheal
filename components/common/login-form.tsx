"use client";

import * as z from "zod";
import CardWrapper from "./card-wrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { loginSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import { InputField } from "../common/input-field";
import { Button } from "../ui/button";
import { FormError } from "./form-error";
// import { FormSuccess } from "./form-success";
export const LoginForm = () => {
  const method = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { handleSubmit } = method;

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    console.log(data);
  };
  return (
    <CardWrapper
      headerLabel="Sign in"
      backButtonLabel="Don't have an account?"
      backButtonHref="/register"
      showSocial
    >
      <Form {...method}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormError message={method.formState.errors.root?.message} />
          <InputField name="email" placeholder="Enter your email address" />
          <InputField
            name="password"
            type="text"
            placeholder="Enter your password"
          />

          <Button
            type="submit"
            className="w-full"
            disabled={method.formState.isSubmitting}
          >
            Login
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
