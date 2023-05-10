import { Router } from "express";
import { createCustomer, getCustomerById, getCustomers, updateCustomerById } from "../controllers/customers.controller.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { customerSchema } from "../schemas/customers.schema.js";


const customersRouter = Router();

customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", getCustomerById);
customersRouter.post("/customers", validateSchema(customerSchema), createCustomer);
customersRouter.put("/customers/:id", validateSchema(customerSchema), updateCustomerById);


export default customersRouter;