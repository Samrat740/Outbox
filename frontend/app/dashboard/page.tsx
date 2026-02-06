"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getScheduledEmails, getSentEmails } from "@/services/emailService";
import { Mail, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";
import ComposeEmailModal from "@/components/ComposeEmailModal";
import EmailDrawer from "@/components/EmailDrawer";


/* ========================= */
/* TYPES */
/* ========================= */

interface Email {
  id: number;
  recipient: string;
  subject: string;
  body: string;
  status: string;
  scheduled_time?: string;
  sent_time?: string;
}

export default function DashboardPage() {

  /* ================= AUTH ================= */

  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  // Prevent dashboard flash
  if (status === "loading") return null;

  /* ================= STATE ================= */

  const [scheduled, setScheduled] = useState<Email[]>([]);
  const [sent, setSent] = useState<Email[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  /* ================= LOAD EMAILS ================= */

  useEffect(() => {

    // 🔥 IMPORTANT — don't call API until authenticated
    if (status !== "authenticated") return;

    loadEmails();

  }, [status]);

  const loadEmails = async () => {
    try {
      const s = await getScheduledEmails(5);
      const se = await getSentEmails(5);

      setScheduled(s || []);
      setSent(se || []);
    } catch (error) {
      console.log("API Error:", error);

      // Prevent UI crash
      setScheduled([]);
      setSent([]);
    }
  };


  return (
    <div className="px-8 py-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-gray-500 text-sm">
            Manage your scheduled and sent emails
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="
            flex items-center gap-2
            bg-gradient-to-r from-indigo-600 to-blue-600
            text-white px-4 py-2
            rounded-lg shadow-md
            hover:scale-105 hover:shadow-lg
            transition text-sm
          "
        >
          + Compose Email
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Scheduled"
          value={scheduled.length}
          icon={<Clock size={18} />}
          color="bg-blue-100 text-blue-600"
        />

        <StatCard
          title="Sent"
          value={sent.length}
          icon={<CheckCircle size={18} />}
          color="bg-green-100 text-green-600"
        />

        <StatCard
          title="Total"
          value={scheduled.length + sent.length}
          icon={<Mail size={18} />}
          color="bg-purple-100 text-purple-600"
        />
      </div>

      {/* EMAIL LISTS */}
      <div className="grid md:grid-cols-2 gap-6">

        <EmailCard
          title="Scheduled Emails"
          emails={scheduled}
          color="blue"
          link="/scheduled"
          onSelect={setSelectedEmail}
        />

        <EmailCard
          title="Sent Emails"
          emails={sent}
          color="green"
          link="/sent"
          onSelect={setSelectedEmail}
        />

      </div>

      {/* MODAL */}
      <ComposeEmailModal
        isOpen={open}
        onClose={() => setOpen(false)}
      />

      {/* DRAWER */}
      <EmailDrawer
        email={selectedEmail}
        onClose={() => setSelectedEmail(null)}
      />

    </div>
  );
}

/* ========================= */
/* EMPTY STATE */
/* ========================= */

function EmptyState({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <Mail size={32} className="text-gray-300 mb-3" />

      <p className="font-medium text-gray-600">
        {title}
      </p>

      <p className="text-sm text-gray-400 mt-1">
        {subtitle}
      </p>
    </div>
  );
}

/* ========================= */
/* STAT CARD */
/* ========================= */

function StatCard({ title, value, icon, color }: any) {
  return (
    <div className="
      bg-white rounded-xl
      px-4 py-3
      shadow-sm
      flex items-center gap-3
      hover:shadow-md transition
    ">
      <div className={`p-2 rounded-lg ${color}`}>
        {icon}
      </div>

      <div>
        <p className="text-gray-500 text-xs">{title}</p>
        <h2 className="text-lg font-semibold leading-none">
          {value}
        </h2>
      </div>
    </div>
  );
}

/* ========================= */
/* EMAIL CARD */
/* ========================= */

function EmailCard({
  title,
  emails,
  color,
  link,
  onSelect,
}: {
  title: string;
  emails: Email[];
  color: string;
  link: string;
  onSelect: (email: Email) => void;
}) {
  return (
    <div className="
      bg-white rounded-xl
      shadow-sm hover:shadow-md
      transition overflow-hidden
    ">

      {/* HEADER */}
      <div
        className={`px-4 py-3 font-semibold text-md flex justify-between
        ${color === "green"
          ? "bg-green-50 text-green-700"
          : "bg-blue-50 text-blue-700"
        }`}
      >
        {title}

        <span className="text-xs bg-white px-2 py-1 rounded-full shadow">
          {emails.length}
        </span>
      </div>

      {/* LIST */}
      <div className="p-4">

        {emails.length === 0 ? (

          <EmptyState
            title={`No ${color === "green" ? "sent" : "scheduled"} emails`}
            subtitle="Start scheduling emails or check your server connection."
          />

        ) : (

          <div className="space-y-3">
            {emails.map((email) => (
              <div
                key={email.id}
                onClick={() => onSelect(email)}
                className="
                  border rounded-lg p-3
                  hover:shadow-sm hover:-translate-y-0.5
                  transition cursor-pointer
                "
              >
                <div className="flex justify-between">
                  <p className="font-medium text-sm">
                    {email.recipient}
                  </p>

                  <span
                    className={`text-xs px-2 py-0.5 rounded-full
                    ${color === "green"
                      ? "bg-green-100 text-green-600"
                      : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {email.status}
                  </span>
                </div>

                <p className="text-gray-500 text-xs">
                  {email.subject}
                </p>

                <p className="text-[11px] text-gray-400 mt-1">
                  {new Date(
                    email.scheduled_time || email.sent_time!
                  ).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

        )}

      </div>

      {/* FOOTER */}
      <div className="text-center pb-4">
        <Link
          href={link}
          className={`text-sm font-medium hover:underline
          ${color === "green"
            ? "text-green-600"
            : "text-blue-600"
          }`}
        >
          View all →
        </Link>
      </div>
    </div>
  );
}
