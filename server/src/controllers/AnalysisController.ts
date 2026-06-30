import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { AnalysisService } from "../services/AnalysisService";
import { ApiError } from "../utils/ApiError";

const askSchema = z.object({
  fileId: z.string().uuid("Invalid file ID"),
  question: z
    .string()
    .min(3, "Question too short")
    .max(300, "Question too long"),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(2000, "Message too long"),
      }),
    )
    .max(20, "Too many messages in history")
    .optional()
    .default([]),
});

export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  ask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw ApiError.unauthorized();

      const result = askSchema.safeParse(req.body);
      if (!result.success)
        throw ApiError.badRequest(result.error.issues[0].message);

      const { fileId, question, history } = result.data;
      const { answer, ragUsed, chunksFound } = await this.analysisService.ask(
        fileId,
        req.user.userId,
        question,
        history,
      );

      res.json({ success: true, data: { answer, ragUsed, chunksFound } });
    } catch (err) {
      next(err);
    }
  };

  report = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw ApiError.unauthorized();
      const fileId = req.params["fileId"] as string;
      if (!fileId) throw ApiError.badRequest("fileId is required");

      const report = await this.analysisService.generateReport(
        fileId,
        req.user.userId,
      );
      res.json({ success: true, data: { report } });
    } catch (err) {
      next(err);
    }
  };
}
