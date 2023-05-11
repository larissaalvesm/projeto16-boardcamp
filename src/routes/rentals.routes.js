import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { createRental, finalizeRental } from "../controllers/rentals.controller.js";
import { rentalSchema } from "../schemas/rentals.schema.js";

const rentalsRoute = Router();

rentalsRoute.post("/rentals", validateSchema(rentalSchema), createRental);
rentalsRoute.post("/rentals/:id/return", finalizeRental);

export default rentalsRoute;