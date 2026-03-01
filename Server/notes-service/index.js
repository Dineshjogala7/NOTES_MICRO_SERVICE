const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config()

const app = express();

const internalAuthMiddleware = require("./middleware/internalAuthMiddleware");
const noteRoutes = require("./routes/notes");
const startCategoryEvent = require("./events/categoryEvents");
const cors = require("cors");

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(internalAuthMiddleware);

app.use("/", noteRoutes);
startCategoryEvent();
app.listen(process.env.PORT, () => {
    console.log("App is running on the port 5001");
})
mongoose.connect(process.env.MONGO_URI).then(() => console.log("Notes mongo is Connected"))
    .catch((err) => console.log("Error in Notes db connection", err))