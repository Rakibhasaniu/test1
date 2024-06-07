import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFoundRoute from "./app/middlewares/notFoundRoute";
import router from "./app/routes";

const app = express();

const corsOptions = {
  origin: ['http://localhost:3000', 'https://flatrent.vercel.app'],
  methods: ['GET', 'POST', "PUT", "PATCH", "DELETE"],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, 
};
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api", (req, res) => {
  res.send("Hello Flat Finder Server");
});

app.use("/api", router);

// Not found route
app.use("*", notFoundRoute);

// Global error handler
app.use(globalErrorHandler);

export default app;
