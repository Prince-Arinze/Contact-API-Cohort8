import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    name: {type: String, required: true},
    phone: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    favorite: {type: Boolean, default: false},
    tags: {type: [String], default: []}
})

const contactModel = mongoose.model("Contacts", contactSchema);

export default contactModel;

