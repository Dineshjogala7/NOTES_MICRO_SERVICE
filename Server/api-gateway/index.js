const express = require("express")
require('dotenv').config();
const cors = require('cors')
const userProxy = require("./proxies/userProxy");
const notesProxy = require("./proxies/notesProxy");
const categoryProxy = require("./proxies/categoryProxy");
const authMiddleware = require("./middleware/authMiddleware");
const jwtRateLimiter = require("./middleware/rateLimiter");
const cookieparser = require('cookie-parser')
const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(cookieparser());

app.get("/", (req, res) => {
  res.send("Api gateway is running !!")
});

app.use("/api/users", userProxy);
app.use("/api/category", authMiddleware, jwtRateLimiter, categoryProxy);
app.use("/api/notes", authMiddleware, jwtRateLimiter, notesProxy);



app.listen(process.env.PORT, () => {
  console.log(`Gateway is listeing at the port ${process.env.PORT}`);
})