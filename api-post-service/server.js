require("dotenv").config({ path: "../.env" });
const express = require("express");
const cors = require("cors");
const postRoutes = require("./routes/postRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", postRoutes);

app.listen(process.env.PORT_POST);
