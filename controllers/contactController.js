import fs from "fs";
import cloudinary from "../config/cloudinary.js";
import { Contact } from "../models/contactModel.js";



export const createContact = async (req, res) => {
    try {
        let photo = "";

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            photo = result.secure_url;

            fs.unlink(req.file.path, (err) => {
                if (err) {
                    console.error(
                        "Failed to remove temp upload:",
                        err.message
                    );
                }
            });
        }

        const contactExists = await Contact.findOne({ phone: req.body.phone });

        if (contactExists) {
            return res.status(409).json({
                success: false,
                message: "A contact with this phone number already exists"
            });
        }

        const { photo: _ignoredPhoto, ...contactFields } = req.body;

        const contact = await Contact.create({
            ...contactFields,
            photo
        });

        res.status(201).json({
            error: false,
            message: "Contact has been created successfully",
            data: contact
        });

    } catch (err) {
        res.status(400).json({
            error: true,
            message: `Failed to create contact: ${err.message}`
        });
    }
};

export const listContacts = async (req, res) => {
    try {
        const { searchTerms, favorite, tag } = req.query;

        const filter = {};

        if (searchTerms?.trim()) {
            const search = searchTerms.trim();

            filter.$or = [
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
            ];
        }

        if (favorite !== undefined) {
            filter.favorite = favorite === "true";
        }

        if (tag?.trim()) {
            const tags = tag
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean);

            filter.tags = {
                $in: tags,
            };
        }

        const contacts = await Contact.find(filter).sort({
            firstName: 1,
            lastName: 1,
        });

        res.status(200).json({
            error: false,
            message: "Contacts fetched successfully",
            data: contacts,
        });
    } catch (err) {
        res.status(500).json({
            error: true,
            message: `Failed to fetch contacts: ${err.message}`,
        });
    }
};

export const getContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({
                error: true,
                message: "Contact not found"
            });
        }

        res.status(200).json({
            error: false,
            message: "Contact found",
            data: contact
        });
    } catch (err) {
        res.status(400).json({
            error: true,
            message: err.message
        });
    }
};

export const updateContact = async (req, res) => {
    try {
        const { photo: _ignoredPhoto, ...updates } = req.body;

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            updates.photo = result.secure_url;

            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Failed to remove temp upload:", err.message);
            });
        }

        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            updates,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!contact) {
            return res.status(404).json({
                error: true,
                message: "Contact not found"
            });
        }

        res.status(200).json({
            error: false,
            message: "Contact updated successfully",
            data: contact
        });
    } catch (err) {
        res.status(400).json({
            error: true,
            message: err.message
        });
    }
};

export const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({
                error: true,
                message: "Contact not found"
            });
        }

        if (contact.photoPublicId) {
            cloudinary.uploader.destroy(contact.photoPublicId)
        }

        await Contact.findByIdAndDelete(req.params.id);


        res.status(200).json({
            error: false,
            message: "Contact has been deleted successfully."
        });
    } catch (error) {
        res.status(400).json({
            error: true,
            message: error.message
        });
    }
};