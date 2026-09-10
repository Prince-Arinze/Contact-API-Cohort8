import express from "express";
import { config } from "dotenv";
import { dbConnection } from "./config/db.js";
import contactRouter from "./routes/contactRoute.js";

config();

const app = express();



app.get(`/`, (req, res) => {
    res.status(200).json({
        message: "Server is running"
    })
});

app.use(express.json());

app.use("/api/v1", contactRouter);

const startServer = async () => {
    try {
        await dbConnection();
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        })
    } catch (err) {
        console.error(err.message);
        process.exit(1)
    }
}

startServer();