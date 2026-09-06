import contactModel from "../model/contactModel.js";

// Create Contact
export const createContact = async (req, res) => {
    const { name, phone, email, favorite, tags } = req.body;
    try {
        let newContact = await contactModel.create({name, phone, email, favorite, tags})
        res.status(201).json({
            message: "New contact created & stored successfully in the Database",
            data: newContact
        });
        console.log("New contact created in the contact database.")
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
        console.error(`Error during contact creation: ${error.message}`);
    }
};

// Update Contact
export const updateContact = async (req, res) => {
    const { id } = req.params;
    const { name, phone, favorite, tags } = req.body;
    try {
        const update = await contactModel.findByIdAndUpdate(id, { name, phone, favorite, tags }, { new: true });
        if (!update) {
            return res.status(404).json({
                message: `No contact with ${id} found`
            });
        } else {
        return res.status(200).json({
            message: 'Contact details updated successfully.',
            data: update
        })
        console.log(`Contact with ID: ${id} just got updated.`);
    }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
        console.log(`Error during contact update. \nAffected contact ID: ${id}`);
    }
};

// Get All Contacts
export const getAllContacts = async (req, res) => {
    try {
        const all = await contactModel.find();
        res.status(200).json({
            message: 'All contacts fetched successfully',
            data: all
        })
        console.log('Successfully fetched all contacts from the Database');
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
        console.log("Error during execution of contacts fetch.")
    }
};

// Delete Contact By ID
export const deleteContact = async (req, res) => {
    const { id } = req.params;
    try {
        const contact_d = await contactModel.findByIdAndDelete(id);
        if (!contact_d) {
            return res.status(404).json({
                message: `No contact with ${id} found. Aborting delete...`
            });
        }
        res.status(200).json({
            message: 'Contact deleted successfully.',
            data: contact_d
        });
        console.log(`Successfully deleted contact (ID: ${id} from Database.)`);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
        console.log(`Error during delete action for contact with ID: ${id}`);
    }
};

// Search For Contact With ID (params)

export const searchContactByID = async (req, res) => {
    const { id } = req.params;
    try {
        const search = await contactModel.findById(id);
        if (!search) {
            return res.status(404).json({
                message: `No contact with ${id} was found in the Database.`
            })
        }
        return res.status(200).json({
            message: "Contact found.",
            data: search
        });
        console.log(`Successfully found contact for ID: ${id}`);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
        console.log(`Internal server error during search for contct with ID: ${id}`);
    }
};

// Search For Contact with either name, email, phone, tags or favorite (Search term in body of request)
export const generalSeacrh = async (req, res) => {
    const { name, email, phone, tags, favorite } = req.body;
    try {
        const filter = {};
        if (name) filter.name = name;
        if (email) filter.email = email;
        if (phone) filter.phone = phone;
        if (favorite !== undefined) filter.favorite = favorite;
        if (tags) {
            filter.tags = Array.isArray(tags) ? { $in: tags } : tags;
        }

        if (Object.keys(filter).length === 0) {
            return res.status(400).json({
                message: "No valid search term provided."
            });
        };
        const searchTerm = await contactModel.find(filter);
        if (searchTerm.length === 0) {
            return res.status(404).json({
                message: "No contact found for that search term. Check again."
            })
        }
        console.log('Contact(s) retrieved from the Database successfully.');
        return res.status(200).json({
            message: "Conatct(s) found successfully.",
            data: searchTerm
        });
        
    } catch (error) {
        console.log("Internal server error during general contacts search");
        res.status(500).json({
            message: error.message
        })
        
    }
};

// Add tags to contacts. Tags could be anything.

export const addTags = async (req, res) => {
    const { id } = req.params;
    const { tags: tagsArray } = req.body;
    const newTags = Array.isArray(tagsArray) ? tagsArray : [tagsArray];
    try {
        const contacts = await contactModel.findById(id);
        if (!contacts) {
            return res.status(404).json({
                message: `Contact with ID: ${id} not found in the Database.`
            });
        }
        for (let loop of newTags) {
            if (!contacts.tags.includes(loop)) {
                contacts.tags.push(loop)
            }
        }
        await contacts.save()
        console.log(`New tags added to the contact with ID: ${id}`)
        res.status(200).json({
            message: "New tags added to contact successfully.",
            data: contacts
        })
    } catch (error) {
        console.log(`Internal server error during tags addition on contact with ID: ${id}`);
        res.status(500).json({
            message: error.message
        });
    }
};

// Add/Remove Contacts From Favorite
export const favoriteContact = async (req, res) => {
    const { id } = req.params;
    try {
        const fav = await contactModel.findById(id);
        if (!fav) {
            return res.status(404).json({
                message: `No contact with ${id} was found in the Database.`
            })
        }
        fav.favorite = !fav.favorite;
        await fav.save()
        console.log(`An update was made on the Favorite status of the contact with ID: ${id}`);
        res.status(200).json({
            message: 'Favorite status changed for the contact below.',
            data: fav
        });
    } catch (error) {
        console.log(`Internal server error during favorite update for contact with ID: ${id}.`);
        res.status(500).json({
            message: error.message
        });
    }
};