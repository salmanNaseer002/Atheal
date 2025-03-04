"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { COLLECTIONS } from "@/enums";
import { queryDocuments } from "@/helper/firebase-helper";
import { User } from "@/types";
import { Briefcase, Calendar, FileText, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const UserProfileList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const fetchUsers = async (lastVisibleId?: string) => {
    try {
      const result = await queryDocuments<User>(COLLECTIONS.USERS, {
        filters: [
          {
            field: "role",
            operator: "==",
            value: "user",
          },
        ],
        orderByField: "createdAt",
        orderDirection: "desc",
        pagination: {
          pageSize: 10,
          lastVisible: lastVisibleId,
        },
      });

      if (lastVisibleId) {
        setUsers((prev) => [...prev, ...result.data]);
      } else {
        setUsers(result.data);
      }

      setLastVisible(result.lastVisible);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLoadMore = () => {
    if (lastVisible) {
      fetchUsers(lastVisible);
    }
  };

  if (isLoading && users.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12 mt-16">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            User Directory
          </h1>
          <p className="mt-2 text-gray-600">
            Browse and manage team members across the organization
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {users.map((user) => (
          <Card
            key={user.id}
            className="p-6 hover:shadow-lg transition-all duration-200 border border-gray-100"
          >
            <div className="flex items-start justify-between">
              <div className="flex gap-6">
                <Avatar className="h-20 w-20 border-2 border-white shadow-md">
                  <AvatarImage
                    src={user.image}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-blue-50 text-blue-600 text-2xl font-medium">
                    {user?.firstName?.slice(0, 1)}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900">
                      {user.firstName} {user.lastName}
                    </h3>
                    {user.location && (
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <p className="text-sm text-gray-500">{user.location}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-6">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm hover:text-blue-600 cursor-pointer">
                        {user.email}
                      </span>
                    </div>
                    {user.role && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Briefcase className="h-4 w-4" />
                        <span className="text-sm">{user.role}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">
                        Joined{" "}
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  {user.bio && (
                    <p className="text-gray-600 max-w-2xl text-sm leading-relaxed">
                      {user.bio}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <Link href={`/user-profiles/${user.id}/documents`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-blue-600 hover:bg-blue-50 cursor-pointer"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Documents
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {hasMore && (
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            className="text-blue-600 hover:bg-blue-50"
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserProfileList;
