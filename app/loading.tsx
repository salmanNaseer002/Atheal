"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-12 mt-16">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <Skeleton className="h-10 w-80" />
      </div>

      <div className="grid gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 border rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex gap-6">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div className="space-y-4">
                  <div>
                    <Skeleton className="h-6 w-48" />
                    <div className="flex items-center gap-2 mt-1">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                  </div>

                  <Skeleton className="h-16 w-full max-w-2xl" />
                </div>
              </div>

              <Skeleton className="h-9 w-32" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
