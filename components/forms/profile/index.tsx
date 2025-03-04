"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, User } from "lucide-react";
import UserInfoForm from "./user-info-form";
import UserDocumentsForm from "./user-documents-form";

const ProfileForm = () => {
  return (
    <div className="min-h-screen bg-white py-12 mt-20">
      <div className="container mx-auto max-w-3xl px-4">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Profile Settings
        </h1>

        <Tabs defaultValue="info" className="space-y-4">
          <TabsList className="border-b border-gray-200 py-6 px-2">
            <TabsTrigger
              value="info"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary px-4 py-2"
            >
              <User className="h-4 w-4 mr-2 inline" />
              Personal Info
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary px-4 py-2"
            >
              <FileText className="h-4 w-4 mr-2 inline" />
              Documents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <UserInfoForm />
          </TabsContent>

          <TabsContent value="documents">
            <UserDocumentsForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfileForm;
