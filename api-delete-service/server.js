require("dotenv").config({ path: "../.env" });
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 6008;
const DB_URL = `http://localhost:5008/db/${process.env.ITEM_SINGULAR}`;

app.use(cors());
app.use(express.json());

app.delete(`/${process.env.APP_NAME}/${process.env.ITEM_SINGULAR}/:id`, async (req, res) => {
    try {
        const response = await fetch(`${DB_URL}/${req.params.id}`, {
            method: "DELETE"
        });
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT);
