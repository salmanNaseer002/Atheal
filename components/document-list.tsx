"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { COLLECTIONS } from "@/enums";
import {
  createStreamListener,
  updateDocumentInSubCollection,
} from "@/helper/firebase-helper";
import {
  CheckCircle,
  FileText,
  LoaderCircle,
  User,
  XCircle,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Document {
  id: string;
  name: string;
  url: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  userName: string;
}

const DocumentList = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const params = useParams();
  const profileId = params.id as string;

  useEffect(() => {
    if (!profileId) return;
    const unsubscribe = createStreamListener<Document>(
      {
        collection: COLLECTIONS.USERS,
        document: profileId,
        subcollection: COLLECTIONS.DOCUMENTS,
      },
      (data) => {
        setDocuments(data);
        setIsLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [profileId]);

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
      approved: "bg-green-100 text-green-800 hover:bg-green-200",
      rejected: "bg-red-100 text-red-800 hover:bg-red-200",
    };

    return (
      <Badge className={`${statusStyles[status as keyof typeof statusStyles]}`}>
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </Badge>
    );
  };

  const handleApprove = async (documentId: string) => {
    try {
      setActionLoading(documentId);
      await updateDocumentInSubCollection(
        COLLECTIONS.USERS,
        profileId,
        COLLECTIONS.DOCUMENTS,
        documentId,
        {
          status: "approved",
          updatedAt: new Date(),
        }
      );
      toast.success("Document approved successfully");
    } catch (error) {
      console.error("Error approving document:", error);
      toast.error("Failed to approve document");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (documentId: string) => {
    try {
      setActionLoading(documentId);
      await updateDocumentInSubCollection(
        COLLECTIONS.USERS,
        profileId,
        COLLECTIONS.DOCUMENTS,
        documentId,
        {
          status: "rejected",
          updatedAt: new Date(),
        }
      );
      toast.success("Document rejected successfully");
    } catch (error) {
      console.error("Error rejecting document:", error);
      toast.error("Failed to reject document");
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 mt-16">
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-6">
                  <Skeleton className="h-16 w-16 rounded-lg" />
                  <div className="space-y-4">
                    <div>
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-32 mt-2" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-9 w-24" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 mt-16">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Document Review
          </h1>
          <p className="mt-2 text-gray-600">
            Review and manage user submitted documents
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {documents.length === 0 ? (
          <Card className="p-6 text-center">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              No documents uploaded yet
            </h3>
            <p className="text-gray-500 mt-2">
              Documents submitted by users will appear here
            </p>
          </Card>
        ) : (
          documents.map((document) => (
            <Card
              key={document.id}
              className="p-6 hover:shadow-lg transition-all duration-200 border border-gray-100"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-6">
                  <div className="h-16 w-16 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <FileText className="h-8 w-8" />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {document.name}
                        </h3>
                        {getStatusBadge(document.status)}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <User className="h-4 w-4 text-gray-400" />
                        <p className="text-sm text-gray-500">
                          {document.userName || "--"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  {document.status === "pending" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 hover:bg-green-50 flex items-center gap-2 cursor-pointer"
                        onClick={() => handleApprove(document.id)}
                        disabled={actionLoading === document.id}
                      >
                        {actionLoading === document.id ? (
                          <LoaderCircle className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                        onClick={() => handleReject(document.id)}
                        disabled={actionLoading === document.id}
                      >
                        {actionLoading === document.id ? (
                          <LoaderCircle className="h-4 w-4 animate-spin" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default DocumentList;
