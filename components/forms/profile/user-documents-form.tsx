"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  addDocumentInSubCollection,
  deleteDocumentInSubCollection,
  uploadFileToStorage,
  deleteFileFromStorage,
  createStreamListener,
} from "@/helper/firebase-helper";
import useAuthSessionContext from "@/lib/context/auth-session-context";
import { FileText, X } from "lucide-react";
import { useState, useEffect } from "react";
import Dropzone from "../../common/dropzone";
import { Badge } from "@/components/ui/badge";

interface UploadedDocument {
  id: string;
  name: string;
  url: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserDocumentsForm = () => {
  const { profile } = useAuthSessionContext();
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!profile?.id) return;
    const unsubscribe = createStreamListener<UploadedDocument>(
      {
        collection: "users",
        document: profile.id,
        subcollection: "documents",
      },
      (data) => {
        console.log(data);
        setDocuments(data);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [profile?.id]);

  const handleFileSelect = async (file: File) => {
    const filePath = `users/${profile?.id}/documents`;
    const fullPath = `${filePath}/${file.name}`;
    setIsUploading(true);

    try {
      const url = await uploadFileToStorage(file, filePath);
      await addDocumentInSubCollection(
        "users",
        profile?.id as string,
        "documents",
        {
          name: file.name,
          url: url,
          status: "pending",
        }
      );
    } catch (error) {
      console.error("Error uploading document:", error);
      try {
        await deleteFileFromStorage(fullPath);
      } catch (deleteError) {
        console.error("Error deleting file after failed upload:", deleteError);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async (file: UploadedDocument) => {
    try {
      await deleteDocumentInSubCollection(
        "users",
        profile?.id as string,
        "documents",
        file.id
      );
      await deleteFileFromStorage(file.url);
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto max-w-3xl">
        <Card className="overflow-hidden bg-white shadow rounded-lg border border-gray-200">
          <div className="p-8">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-base font-semibold text-gray-900">
                Upload Documents
              </h2>
            </div>

            <Dropzone onFileSelect={handleFileSelect} isLoading={isUploading} />

            {/* Display uploaded documents */}
            {documents.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Uploaded Documents
                </h3>
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="mt-4 p-4 bg-gray-50 rounded-lg flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-primary" />
                          <span className="text-sm text-gray-700 truncate max-w-[200px]">
                            {doc.name}
                          </span>
                        </div>
                        <Badge
                          variant={
                            doc.status === "approved"
                              ? "success"
                              : doc.status === "rejected"
                              ? "destructive"
                              : "secondary"
                          }
                          className="capitalize"
                        >
                          {doc.status}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteDocument(doc)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UserDocumentsForm;
