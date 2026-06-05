import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { AuthService } from "../services/AuthService";
import { ApiError } from "../utils/ApiError";

const credentialsSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = credentialsSchema.safeParse(req.body);
      if (!result.success)
        throw ApiError.badRequest(result.error.issues[0].message);

      const token = await this.authService.register(
        result.data.email,
        result.data.password,
      );
      res.status(201).json({ success: true, data: { token } });
    } catch (err) {
      next(err);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = credentialsSchema.safeParse(req.body);
      if (!result.success)
        throw ApiError.badRequest(result.error.issues[0].message);

      const token = await this.authService.login(
        result.data.email,
        result.data.password,
      );
      res.json({ success: true, data: { token } });
    } catch (err) {
      next(err);
    }
  };

  me = (req: Request, res: Response) => {
    res.json({ success: true, data: { user: req.user } });
  };
}
