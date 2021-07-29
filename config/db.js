const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

const connectDB = async () => {
    try {
        mongoose.connect(db, {
            useUnifiedTopology: true,
            useCreateIndex: true,
            useNewUrlParser: true,
            useFindAndModify: false,
        });
        console.log("connected");
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}
module.exports = connectDB;