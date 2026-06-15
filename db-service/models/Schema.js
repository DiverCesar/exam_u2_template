const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema(
    {
        id: { type: Number },
        name: { type: String },
        brand: { type: String },
        model: { type: String },
        price: { type: Number },
        date: { type: Date, default: Date.now },
        description: { type: String },
        isActive: { type: Boolean }
    },
    { collection: process.env.COLLECTION_NAME }
);

module.exports = mongoose.model("Data", dataSchema);
