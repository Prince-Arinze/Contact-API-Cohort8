import {Router} from "express";
import { createContact, deleteContact, getContact, listContacts, updateContact } from "../controllers/contactController";

const contactRouter = Router();


contactRouter.get("/contacts", listContacts);
contactRouter.get("/contacts/:id", getContact);
contactRouter.post("/contacts", createContact);
contactRouter.patch("/contacts/:id", updateContact);
contactRouter.delete("/contacts/:id", deleteContact);

export default contactRouter;