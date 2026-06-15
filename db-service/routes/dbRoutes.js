const express = require("express");
const router = express.Router();
const Data = require("../models/Schema");

const plural = process.env.ITEM_PLURAL;
const singular = process.env.ITEM_SINGULAR;

router.get(`/${plural}`, async (req, res) => {
    try {
        const data = await Data.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post(`/${singular}`, async (req, res) => {
    try {
        const newData = new Data(req.body);
        const savedData = await newData.save();
        res.status(201).json(savedData);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put(`/${singular}/:id`, async (req, res) => {
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

router.delete(`/${singular}/:id`, async (req, res) => {
    try {
        const deletedData = await Data.findOneAndDelete({ id: req.params.id });
        if (!deletedData) return res.status(404).json({ error: "Not found" });
        res.json({ message: "Deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
