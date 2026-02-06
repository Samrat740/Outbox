import { Request, Response } from "express";
import { pool } from "../db";
import { emailQueue } from "../queues/emailQueue";


// ✅ Schedule Email
export const scheduleEmail = async (req: Request, res: Response) => {
  try {
    const { recipient, subject, body, scheduled_time } = req.body;

    if (!recipient || !subject || !body || !scheduled_time) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    // Save to DB
    const result = await pool.query(
      `INSERT INTO emails
       (recipient, subject, body, scheduled_time, status)
       VALUES ($1,$2,$3,$4,'scheduled')
       RETURNING *`,
      [recipient, subject, body, scheduled_time]
    );

    const email = result.rows[0];

    // Calculate delay
    const delay = new Date(scheduled_time).getTime() - Date.now();

    await emailQueue.add(
      "sendEmail",
      { emailId: email.id },
      {
        delay: Math.max(delay, 0),
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 5000,
        },
      }
    );

    res.json({
      message: "✅ Email scheduled successfully",
      email,
    });

  } catch (error) {
    console.error("Schedule Email Error:", error);

    res.status(500).json({
      error: "Failed to schedule email",
    });
  }
};



// ✅ Get Scheduled Emails (with optional limit)
export const getScheduledEmails = async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit
      ? Number(req.query.limit)
      : null;

    let query = `
      SELECT *
      FROM emails
      WHERE status = 'scheduled'
      ORDER BY scheduled_time ASC
    `;

    const values: any[] = [];

    if (limit) {
      query += ` LIMIT $1`;
      values.push(limit);
    }

    const result = await pool.query(query, values);

    res.json(result.rows);

  } catch (error) {
    console.error("Fetch Scheduled Error:", error);

    res.status(500).json({
      error: "Failed to fetch scheduled emails",
    });
  }
};



// ✅ Get Sent Emails (with optional limit)
export const getSentEmails = async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit
      ? Number(req.query.limit)
      : null;

    let query = `
      SELECT *
      FROM emails
      WHERE status = 'sent'
      ORDER BY sent_time DESC
    `;

    const values: any[] = [];

    if (limit) {
      query += ` LIMIT $1`;
      values.push(limit);
    }

    const result = await pool.query(query, values);

    res.json(result.rows);

  } catch (error) {
    console.error("Fetch Sent Error:", error);

    res.status(500).json({
      error: "Failed to fetch sent emails",
    });
  }
};
