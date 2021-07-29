const express = require("express");
const connectDB = require("./config/db");
var cors = require("cors");
const app = express();

// connecting to The Db
connectDB();

// Initializing Middleware
app.use(express.json({ extended: false }));
app.use(cors());

app.get("/", (req, res) => res.json({ msg: "welcome To TODO App" }));

//Define Routes

app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/sections", require("./routes/sections"));
app.use("/api/subSections", require("./routes/subSections"));
app.use("/api/memos", require("./routes/memos"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
