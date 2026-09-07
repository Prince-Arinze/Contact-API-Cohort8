import express from "express";
import mongoose from "mongoose";
import contactRouter from "./routes/contactRoutes.js";

const compassString = "mongodb://localhost:27017/contact_api_db";

mongoose
.connect(compassString)
.then(() => console.log(`Connection established successfully with local Mongo Database!`))
.catch(() => console.log(`Error during connection with local Mongo Database`));


const PORT = 4707;
let terminalMessage = `Server is now running on port ${PORT}.\nLive at => http://localhost:${PORT}`;

const app = express();

app.use(express.json());

app.get(`/`, (req, res) => {
    res.status(200).json({
        message: "Server is up and running!"
    });
});

app.use("/contacts", contactRouter);

app.listen(PORT, () => {
    console.log(terminalMessage);
});