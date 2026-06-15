require("dotenv").config({ path: "../.env" });
const express = require("express");
const cors = require("cors");
const deleteRoutes = require("./routes/deleteRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", deleteRoutes);

app.listen(process.env.PORT_DELETE);
