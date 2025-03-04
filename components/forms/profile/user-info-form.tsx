"use client";

import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { COLLECTIONS } from "@/enums";
import { updateDocument } from "@/helper/firebase-helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { FormError } from "../../common/form-error";
import { FormSuccess } from "../../common/form-success";
import { InputField } from "../../common/input-field";
import { Button } from "../../ui/button";
import useAuthSessionContext from "@/lib/context/auth-session-context";
import { userInfoFormSchema } from "@/schemas";
import * as z from "zod";

type UserInfoFormValues = z.infer<typeof userInfoFormSchema>;
const UserInfoForm = () => {
  const { profile } = useAuthSessionContext();

  const form = useForm<UserInfoFormValues>({
    resolver: zodResolver(userInfoFormSchema),
    defaultValues: {
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      email: profile?.email || "",
      bio: profile?.bio || "",
    },
  });

  const { handleSubmit } = form;

  const onSubmit = async (values: UserInfoFormValues) => {
    try {
      if (!profile) {
        throw new Error("Profile ID is required");
      }
      await updateDocument(COLLECTIONS.USERS, profile.id, values);
    } catch (error) {
      console.error(error);
      form.setError("root", {
        message: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className=" bg-gray-50/50">
      <div className="container mx-auto max-w-3xl">
        <Card className="overflow-hidden bg-white shadow rounded-lg border border-gray-200">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 p-8">
              <FormError message={form.formState.errors.root?.message} />
              {form.formState.isSubmitSuccessful && (
                <FormSuccess message="Profile updated successfully" />
              )}

              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <User className="h-5 w-5 text-primary" />
                    <h2 className="text-base font-semibold text-gray-900">
                      Personal Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <InputField
                      name="firstName"
                      label="First Name"
                      placeholder="Enter your first name"
                      type="text"
                    />
                    <InputField
                      name="lastName"
                      label="Last Name"
                      placeholder="Enter your last name"
                      type="text"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <Mail className="h-5 w-5 text-primary" />
                    <h2 className="text-base font-semibold text-gray-900">
                      Contact Details
                    </h2>
                  </div>

                  <InputField
                    name="email"
                    label="Email Address"
                    placeholder="Enter your email address"
                    type="email"
                    disabled
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <User className="h-5 w-5 text-primary" />
                    <h2 className="text-base font-semibold text-gray-900">
                      About
                    </h2>
                  </div>

                  <InputField
                    name="bio"
                    label="Bio"
                    placeholder="Tell us about yourself..."
                    multiline
                    rows={4}
                  />
                </div>
              </div>

              <div className="pt-6 flex items-center justify-end gap-4">
                <Button
                  className="cursor-pointer"
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  disabled={
                    form.formState.isSubmitting || !form.formState.isDirty
                  }
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="min-w-[100px] cursor-pointer"
                  disabled={
                    form.formState.isSubmitting || !form.formState.isDirty
                  }
                >
                  {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default UserInfoForm;
