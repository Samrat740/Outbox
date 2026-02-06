"use client";

import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { Bell, Settings, LogOut, Mail } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <div className="w-full h-16 bg-white border-b flex items-center justify-between px-8 shadow-sm">
      
      {/* LEFT — Logo */}
      <div className="flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <Mail className="text-white" size={18} />
        </div>

        <div>
          <h1 className="font-semibold text-lg leading-tight">
            ReachInbox
          </h1>
          <p className="text-xs text-gray-500 -mt-1">
            Email Scheduler
          </p>
        </div>
      </div>



      {/* RIGHT — Icons + User */}
      <div className="flex items-center gap-6">
        
        <Bell
          className="text-gray-600 cursor-pointer hover:text-black"
          size={20}
        />

        <Settings
          className="text-gray-600 cursor-pointer hover:text-black"
          size={20}
        />

        <div className="flex items-center gap-3 border-l pl-6">
          {session?.user?.image && (
            <Image
              src={session.user.image}
              alt="avatar"
              width={36}
              height={36}
              className="rounded-full"
            />
          )}

          <div className="leading-tight">
            <p className="text-sm font-semibold">
              {session?.user?.name}
            </p>
            <p className="text-xs text-gray-500">
              {session?.user?.email}
            </p>
          </div>

          <LogOut
            onClick={() => signOut({ callbackUrl: "/" })}
            size={18}
            className="cursor-pointer text-gray-600 hover:text-red-500"
          />
        </div>
      </div>
    </div>
  );
}
