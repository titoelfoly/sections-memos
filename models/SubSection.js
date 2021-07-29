const mongoose = require("mongoose");

const SubSectionSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "sections",
  },
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("subSection", SubSectionSchema);
