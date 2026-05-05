import { Router } from "express";
import { getUserHistory, clearHistory } from "../controllers/historyController.js";

export const historyRouter = Router();
historyRouter.get("/", getUserHistory);
historyRouter.delete("/", clearHistory);
