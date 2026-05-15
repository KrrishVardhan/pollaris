import express from "express";
import type { Router } from "express";
import AuthenticationController from "./controller.js";
import { optionalAuthenticationMiddleware } from "../../../common/middlewares/auth-middleware.js";

const authController = new AuthenticationController();
export const authRouter: Router = express.Router();

authRouter.post(
  "/register",
  authController.handleRegister.bind(authController),
);
authRouter.post("/login", authController.handleLogin.bind(authController));

authRouter.get("/me", optionalAuthenticationMiddleware(), (req, res) => {
  // @ts-ignore
  res.json(req.user);
});
