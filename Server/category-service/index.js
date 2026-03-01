const express = require("express");
const mongoose = require("mongoose");

require('dotenv').config();

const app = express();

const internalAuthMiddleware = require('./middleware/internalAuthMiddleware');
const categoryRoutes = require("./routes/categoryRoutes");
const cors = require("cors");

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(internalAuthMiddleware);

app.use("/", categoryRoutes);

app.listen(process.env.PORT, () => {
    console.log("App is running on the port 5002");
})

mongoose.connect(process.env.MONGO_URI).then(() => console.log("Category mongo is Connected"))
    .catch((err) => console.log("Error in Category db connection", err))