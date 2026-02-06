"use client";

import { useState } from "react";
import axios from "axios";

export default function ComposeEmailModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await axios.post("http://localhost:5000/emails/schedule", {
        recipient,
        subject,
        body,
        scheduled_time: scheduledTime,
      });

      alert("✅ Email Scheduled!");

      onClose();

      setRecipient("");
      setSubject("");
      setBody("");
      setScheduledTime("");
    } catch (err: any) {
      console.log(err.response?.data || err.message);
      alert("❌ Failed to schedule email");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      
      <div className="bg-white rounded-xl p-6 w-[500px] shadow-lg">
        
        <h2 className="text-2xl font-semibold mb-4">
          Compose Email
        </h2>

        <input
          placeholder="Recipient"
          className="w-full border p-2 rounded mb-3"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />

        <input
          placeholder="Subject"
          className="w-full border p-2 rounded mb-3"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <textarea
          placeholder="Email body"
          className="w-full border p-2 rounded mb-3"
          rows={4}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />

        <input
          type="datetime-local"
          className="w-full border p-2 rounded mb-4"
          value={scheduledTime}
          onChange={(e) => setScheduledTime(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded"
          >
            {loading ? "Scheduling..." : "Schedule"}
          </button>
        </div>

      </div>
    </div>
  );
}
