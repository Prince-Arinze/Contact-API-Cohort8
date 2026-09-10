import { Schema, model } from "mongoose";


const contactSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    tags: [
        {
            type: String,
            trim: true,
        },
    ],
    favorite: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});


export const Contact = model("Contact", contactSchema);