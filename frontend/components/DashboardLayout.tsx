"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* TOP NAVBAR */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          
          <h1 className="text-2xl font-bold">
            ReachInbox Scheduler
          </h1>

          <div className="flex items-center gap-4">
            {session?.user?.image && (
              <Image
                src={session.user.image}
                alt="avatar"
                width={40}
                height={40}
                className="rounded-full"
              />
            )}

            <button
              onClick={() => signOut()}
              className="bg-black text-white px-4 py-2 rounded-lg hover:opacity-80 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto p-6">
        {children}
      </div>
    </div>
  );
}
