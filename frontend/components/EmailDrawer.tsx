"use client";

import { X } from "lucide-react";

interface Email {
  id: number;
  recipient: string;
  subject: string;
  body: string;
  scheduled_time?: string;
  sent_time?: string;
  status: string;
}

export default function EmailDrawer({
  email,
  onClose,
}: {
  email: Email | null;
  onClose: () => void;
}) {
  if (!email) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
      />

      {/* Drawer */}
      <div className="
        fixed right-0 top-0 h-full w-[420px]
        bg-white shadow-2xl z-50
        animate-slideIn
        flex flex-col
      ">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-lg font-semibold">
            Email Details
          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto">

          <div>
            <p className="text-sm text-gray-500">To</p>
            <p className="font-medium">{email.recipient}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Subject</p>
            <p className="font-medium">{email.subject}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Status</p>
            <span className="
              inline-block px-3 py-1 text-xs rounded-full
              bg-blue-100 text-blue-600
            ">
              {email.status}
            </span>
          </div>

          {(email.sent_time || email.scheduled_time) && (
            <div>
              <p className="text-sm text-gray-500">
                {email.sent_time ? "Sent At" : "Scheduled For"}
              </p>

              <p>
                {new Date(
                  email.sent_time || email.scheduled_time!
                ).toLocaleString()}
              </p>
            </div>
          )}

          <div>
            <p className="text-sm text-gray-500 mb-2">
              Body
            </p>

            <div className="
              bg-gray-50 p-4 rounded-lg
              whitespace-pre-wrap
              text-sm leading-relaxed
            ">
              {email.body}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
