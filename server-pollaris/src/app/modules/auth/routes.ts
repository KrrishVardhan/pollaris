import express from "express";
import type { Router } from "express";
import AuthenticationController from "./controller.js";

const authController = new AuthenticationController()
export const authRouter: Router = express.Router()

authRouter.post('/register', authController.handleRegister.bind(authController))