import { Router } from "express";
import { getQuestions, getRandomQuestion } from "../controllers/questionsController.js";

export const questionsRouter = Router();
questionsRouter.get("/", getQuestions);
questionsRouter.get("/random", getRandomQuestion);
