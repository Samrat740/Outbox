"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import EmailTable from "@/components/EmailTable";
import { getScheduledEmails } from "@/services/emailService";

export default function ScheduledPage() {
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await getScheduledEmails();
      setEmails(data);
    };

    load();
  }, []);

  return (
    <DashboardLayout>
      <EmailTable title="All Scheduled Emails" emails={emails} />
    </DashboardLayout>
  );
}
