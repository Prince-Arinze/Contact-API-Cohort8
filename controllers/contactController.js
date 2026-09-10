const { Contact } = require("../models/contactModel");


export const createContact = async (req, res) => {
    try {
        const contact = await Contact.create(req.body);
        res.status(201).json({
            error: false,
            meassage: "Contact has been created successfully",
            data: contact
        });
    } catch (err) {
        res.status(400).json({
            error: true,
            message: `Failed to create contact: ${err.message}`
        })
    }
}
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
            })
        }

        res.status(200).json({
            error: false,
            message: "Contact found",
            data: contact
        })
    } catch (err) {
        res.status(400).json({
            error: true,
            message: err.message
        })
    }
}


export const updateContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            });

        if (!contact) {
            return res.status(404).json({
                error: true,
                message: "Contact not found"
            })
        };

        res.status(200).json({
            error: false,
            message: "Contact updated successfully",
            data: contact
        })
    } catch (err) {
        res.status(400).json({
            error: true,
            message: err.message
        })
    }
}

export const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) {
            return res.status(404).json({
                error: true,
                message: "Contact not found"
            })
        };
        res.status(200).json({
            error: false,
            message: "Contact has been deleted successfully."
        })
    } catch (error) {
        res.status(400).json({
            error: true,
            message: err.message
        })
    }
}