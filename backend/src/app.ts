import express from "express";
import cors from "cors";
import emailRoutes from "./routes/emailRoutes";

const app = express();

/*
✅ Railway / Production Safe CORS
Allows:
- Localhost (development)
- Your deployed frontend (Vercel)
*/
app.use(
  cors({
    origin: [
      "http://localhost:3000", // local dev
      process.env.FRONTEND_URL as string, // production frontend
    ],
    credentials: true,
  })
);

app.use(express.json());

app.use("/emails", emailRoutes);

/*
✅ VERY IMPORTANT
Railway provides PORT dynamically
*/
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
