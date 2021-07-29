const mongoose = require("mongoose");

const MemoSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  subsection: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subsections",
  },
  name: {
    type: String,
    required: true,
  },
  field: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "field",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  content: {
    type: String,
  },
});

module.exports = mongoose.model("memo", MemoSchema);
