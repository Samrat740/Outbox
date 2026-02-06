import { Worker } from "bullmq";
import { redis } from "../config/redis";
import { pool } from "../db";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { canSendEmail } from "../utils/rateLimiter";

dotenv.config(); // ⭐ loads .env

//--------------------------------------------------
// Create transporter ONLY ONCE (very important)
//--------------------------------------------------

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: process.env.ETHEREAL_USER,
    pass: process.env.ETHEREAL_PASS,
  },
});

//--------------------------------------------------
// Worker
//--------------------------------------------------

const worker = new Worker(
  "emailQueue",
  async (job) => {
    console.log("🔥 JOB RECEIVED:", job.id);

    const { emailId } = job.data;

    try {
      //--------------------------------------------------
      // Fetch email from DB
      //--------------------------------------------------
      const result = await pool.query(
        `SELECT * FROM emails WHERE id=$1`,
        [emailId]
      );

      const email = result.rows[0];

      if (!email) {
        throw new Error("Email not found in DB");
      }

      const allowed = await canSendEmail();

      if (!allowed) {

        console.log("⛔ Rate limit reached. Delaying job...");

        // calculate delay until next hour
        const now = new Date();
        const nextHour = new Date(now);
        nextHour.setHours(now.getHours() + 1, 0, 0, 0);

        const delay = nextHour.getTime() - now.getTime();

        if (!allowed) {

          console.log("⛔ Rate limit hit — retrying later");

          const now = new Date();
          const nextHour = new Date(now);

          nextHour.setHours(now.getHours() + 1, 0, 0, 0);

          const delayMs = nextHour.getTime() - now.getTime();


          throw new Error(`RATE_LIMIT:${delayMs}`);
        }

      }


      //--------------------------------------------------
      // Send Email
      //--------------------------------------------------
      const info = await transporter.sendMail({
        from: '"ReachInbox Scheduler" <scheduler@test.com>',
        to: email.recipient,
        subject: email.subject,
        text: email.body,
      });

      console.log("✅ Email sent!");
      console.log(
        "📨 Preview URL:",
        nodemailer.getTestMessageUrl(info)
      );

      //--------------------------------------------------
      // Update DB
      //--------------------------------------------------
      await pool.query(
        `UPDATE emails 
         SET status='sent', sent_time=NOW()
         WHERE id=$1`,
        [emailId]
      );

    } catch (err: any) {

    // ⭐ If rate limited → DO NOTHING
    if (err.message?.startsWith("RATE_LIMIT")) {

      console.log("⏳ Email postponed due to rate limiting");

      // IMPORTANT: do NOT mark failed
      return;
    }

    //--------------------------------
    // REAL failure (SMTP etc)
    //--------------------------------

    console.error("❌ Email failed:", err);

    await pool.query(
      `UPDATE emails 
      SET status='failed'
      WHERE id=$1`,
      [emailId]
    );
  }

  },
  {
    connection: redis,
    concurrency: 1,

    limiter: {
      max: 1,
      duration: 2000, // 2 seconds
    }

  }
);

//--------------------------------------------------
// Worker lifecycle logs (VERY professional)
//--------------------------------------------------
console.log("USER:", process.env.ETHEREAL_USER);


worker.on("ready", () => {
  console.log("✅ Worker READY");
});

worker.on("completed", (job) => {
  console.log(`🎉 Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.log(`💥 Job ${job?.id} failed:`, err.message);
});

worker.on("error", (err) => {
  console.log("🚨 Worker error:", err);
});
