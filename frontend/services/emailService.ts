import apiClient from "@/lib/apiClient";

export const getScheduledEmails = async (limit?: number) => {
  const url = limit
    ? `/emails/scheduled?limit=${limit}`
    : `/emails/scheduled`;

  const res = await apiClient.get(url);
  return res.data;
};

export const getSentEmails = async (limit?: number) => {
  const url = limit
    ? `/emails/sent?limit=${limit}`
    : `/emails/sent`;

  const res = await apiClient.get(url);
  return res.data;
};
