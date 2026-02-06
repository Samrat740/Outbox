"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import EmailTable from "@/components/EmailTable";
import { getSentEmails } from "@/services/emailService";

export default function SentPage() {
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await getSentEmails();
      setEmails(data);
    };

    load();
  }, []);

  return (
    <DashboardLayout>
      <EmailTable title="All Sent Emails" emails={emails} />
    </DashboardLayout>
  );
}
