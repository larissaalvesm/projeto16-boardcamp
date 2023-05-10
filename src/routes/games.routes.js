import { Router } from "express";
import { createGame, getGames } from "../controllers/games.controller.js";


const gamesRouter = Router();

gamesRouter.post("/games", createGame);
gamesRouter.get("/games", getGames);

export default gamesRouter;