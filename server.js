import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";
import { dbConnection } from "./config/db.js";
import contactRouter from "./routes/contactRoute.js";

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (req, res) => {
    res.status(200).json({
        message: "Server is running"
    });
});

app.use("/api/v1", contactRouter);

const startServer = async () => {
    try {
        await dbConnection();
       app.listen(process.env.PORT || 3002, "0.0.0.0", () => {
           console.log(`Server is running on port ${process.env.PORT || 3002}`);
       });
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

startServer();