import express from "express";
import type { Express } from "express";

import { authRouter } from "./modules/auth/routes.js";

export function createExpressApp(): Express {
  const app = express();

  // Middleware
  app.use(express.json());

  // Routes
  app.get("/", (req, res) => {
    return res.json({
      message: "Welcome to Pollaris Auth",
    });
  });
  app.use("/auth", authRouter);
  return app;
}
