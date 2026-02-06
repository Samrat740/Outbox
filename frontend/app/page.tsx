"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Mail } from "lucide-react";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  // Redirect if logged in
  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50">

      {/* Card */}
      <div className="bg-white shadow-xl rounded-3xl px-12 py-14 max-w-xl w-full text-center border">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="bg-indigo-600 p-4 rounded-2xl shadow-md">
            <Mail className="text-white" size={28} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold tracking-tight">
          ReachInbox
        </h1>

        <p className="text-gray-500 mt-2 text-sm">
          Intelligent Email Scheduling Platform
        </p>

        {/* Value Prop */}
        <p className="mt-6 text-gray-600 leading-relaxed">
          Schedule, manage, and deliver emails at scale with built-in
          rate limiting, queueing, and real-time tracking.
        </p>

        {/* CTA */}
        <button
          onClick={() => signIn("google")}
          className="
            mt-8 w-full
            bg-black text-white
            py-3 rounded-xl
            font-medium
            hover:bg-gray-800
            transition
            shadow-md
          "
        >
          Continue with Google →
        </button>

        {/* Footer */}
        <p className="text-xs text-gray-400 mt-6">
          Built for reliable, production-grade email workflows.
        </p>

      </div>
    </div>
  );
}
