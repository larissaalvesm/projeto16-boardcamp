import { Router } from "express";
import gamesRouter from "./games.routes.js";
import customersRouter from "./customers.routes.js";
import rentalsRoute from "./rentals.routes.js";

const router = Router();

router.use(gamesRouter);
router.use(customersRouter);
router.use(rentalsRoute);

export default router;