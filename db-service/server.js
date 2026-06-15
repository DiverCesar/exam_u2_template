require("dotenv").config({ path: "../.env" });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Data = require("./models/Schema");

const app = express();
const PORT = 5008;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

app.get(`/db/${process.env.ITEM_PLURAL}`, async (req, res) => {
    try {
        const data = await Data.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post(`/db/${process.env.ITEM_SINGULAR}`, async (req, res) => {
    try {
        const newData = new Data(req.body);
        const savedData = await newData.save();
        res.status(201).json(savedData);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put(`/db/${process.env.ITEM_SINGULAR}/:id`, async (req, res) => {
    try {
        const updatedData = await Data.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true }
        );
        if (!updatedData) return res.status(404).json({ error: "Not found" });
        res.json(updatedData);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete(`/db/${process.env.ITEM_SINGULAR}/:id`, async (req, res) => {
    try {
        const deletedData = await Data.findOneAndDelete({ id: req.params.id });
        if (!deletedData) return res.status(404).json({ error: "Not found" });
        res.json({ message: "Deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT);
