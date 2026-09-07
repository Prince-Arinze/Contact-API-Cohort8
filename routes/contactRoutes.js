import express from "express";

import { createContact, updateContact, getAllContacts, deleteContact, generalSeacrh, searchContactByID, addTags, favoriteContact } from "../controller/contactController.js";

const contactRouter = express.Router();

contactRouter.post("/create-contact", createContact);
contactRouter.patch("/update-contact/:id", updateContact);
contactRouter.get("/get-all-contacts", getAllContacts);
contactRouter.delete("/delete-contact/:id", deleteContact);
contactRouter.get("/search-contacts/:id", searchContactByID);
contactRouter.get("/search-contacts", generalSeacrh);
contactRouter.patch("/add-tags/:id", addTags);
contactRouter.patch("/add-favorite/:id", favoriteContact);


export default contactRouter;

