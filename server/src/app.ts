import express from "express";
import cors from "cors";
import morgan from "morgan";
import fs from "fs";

import { env } from "./config/env";
import { logger } from "./utils/logger";

import { ExcelParser } from "./implementations/parsers/ExcelParser";
import { GeminiAIService } from "./implementations/ai/GeminiAIService";

import { FileRepository } from "./repositories/FileRepository";
import { UserRepository } from "./repositories/UserRepository";

import { AuthService } from "./services/AuthService";
import { FileService } from "./services/FileService";
import { AnalysisService } from "./services/AnalysisService";

import { AuthController } from "./controllers/AuthController";
import { FileController } from "./controllers/FileController";
import { AnalysisController } from "./controllers/AnalysisController";

import { createAuthRouter } from "./routes/auth.routes";
import { createFileRouter } from "./routes/file.routes";
import { createAnalysisRouter } from "./routes/analysis.routes";

import { errorMiddleware } from "./middlewares/error.middleware";

fs.mkdirSync(env.uploadDir, { recursive: true });

const excelParser = new ExcelParser();
const aiService = new GeminiAIService();
const fileRepo = new FileRepository();
const userRepo = new UserRepository();

const authService = new AuthService(userRepo);
const fileService = new FileService(fileRepo, excelParser);
const analysisService = new AnalysisService(excelParser, aiService, fileRepo);

const authController = new AuthController(authService);
const fileController = new FileController(fileService);
const analysisController = new AnalysisController(analysisService);

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/auth", createAuthRouter(authController));
app.use("/api/files", createFileRouter(fileController));
app.use("/api/analysis", createAnalysisRouter(analysisController));

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use(errorMiddleware);

app.listen(env.port, () => {
  logger.info(`Server running on http://localhost:${env.port}`);
});

export default app;
