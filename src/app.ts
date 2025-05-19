import express, { ErrorRequestHandler } from "express";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import uploadRouter from "./routes/upload.route";

const app = express();

app.use(express.json());

app.use("/api", uploadRouter);

// Global error handler (should be after routes)
app.use(errorHandler as ErrorRequestHandler);

export default app;
