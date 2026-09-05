const express = require("express");

const app = express();


const PORT = 8080;

app.get(`/`, (req, res) => {
    res.status(200).json({
        message: "Server is running"
    })
});

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})