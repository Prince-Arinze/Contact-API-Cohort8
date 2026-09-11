import "dotenv/config";

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dbConnection } from "./config/db.js";
import contactRouter from "./routes/contactRoute.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());

app.get("/api/health", (req, res) => {
    res.status(200).json({
        message: "Server is running"
    });
});

app.use("/api/v1", contactRouter);

if (process.env.NODE_ENV === "production") {
    const clientDist = path.join(__dirname, "client", "dist");
    app.use(express.static(clientDist));

    app.get("/*splat", (req, res) => {
        res.sendFile(path.join(clientDist, "index.html"));
    });
}

const startServer = async () => {
    try {
        await dbConnection();

        const PORT = process.env.PORT || 3002;

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

startServer();