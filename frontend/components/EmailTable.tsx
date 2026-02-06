"use client";

import { useState } from "react";

interface Email {
  id: number;
  recipient: string;
  subject: string;
  body: string;
  status: string;
  scheduled_time?: string;
  sent_time?: string;
}

export default function EmailTable({
  title,
  emails,
}: {
  title: string;
  emails: Email[];
}) {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  return (
    <div className="bg-white rounded-xl shadow p-5">
      
      <h2 className="text-xl font-semibold mb-4">{title}</h2>

      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="p-2">Recipient</th>
            <th className="p-2">Subject</th>
            <th className="p-2">Time</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>

        <tbody>
          {emails.map((email) => (
            <tr
              key={email.id}
              onClick={() => setSelectedEmail(email)}
              className="border-b cursor-pointer hover:bg-gray-100 transition"
            >
              <td className="p-2">{email.recipient}</td>

              <td className="p-2">{email.subject}</td>

              <td className="p-2">
                {email.sent_time
                  ? new Date(email.sent_time).toLocaleString()
                  : new Date(
                      email.scheduled_time!
                    ).toLocaleString()}
              </td>

              <td className="p-2">
                <span
                  className={`px-2 py-1 rounded text-sm font-medium ${
                    email.status === "sent"
                      ? "bg-green-100 text-green-700"
                      : email.status === "scheduled"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {email.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔥 EMAIL MODAL */}
      {selectedEmail && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          
          <div className="bg-white p-6 rounded-xl w-[600px] shadow-lg">
            
            <h2 className="text-2xl font-semibold mb-2">
              {selectedEmail.subject}
            </h2>

            <p className="text-gray-500 mb-4">
              To: {selectedEmail.recipient}
            </p>

            <div className="border p-4 rounded bg-gray-50 whitespace-pre-wrap">
              {selectedEmail.body}
            </div>

            <button
              onClick={() => setSelectedEmail(null)}
              className="mt-4 bg-black text-white px-4 py-2 rounded"
            >
              Close
            </button>

          </div>
        </div>
      )}
    </div>
  );
}
