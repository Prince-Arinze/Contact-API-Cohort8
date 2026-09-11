import express from "express";
import { createContact, deleteContact, getContact, listContacts, updateContact } from "../controllers/contactController.js";
import upload from "../config/multer.js";

const contactRouter = express.Router();


contactRouter.get("/contacts", listContacts);
contactRouter.get("/contacts/:id", getContact);
contactRouter.post("/contacts", upload.single("photo"), createContact);
contactRouter.patch("/contacts/:id",  upload.single("photo"), updateContact);
contactRouter.delete("/contacts/:id", deleteContact);

export default contactRouter;