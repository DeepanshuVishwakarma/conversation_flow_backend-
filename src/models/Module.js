const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema({
  name: String,
  module_id: String,

  questions: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Question" }
  ],

  startQuestion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
  },
});

module.exports = mongoose.model("Module", moduleSchema);