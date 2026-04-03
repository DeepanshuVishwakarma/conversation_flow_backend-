const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: String,
  question_id: String,

  options: {
    yes: {
      nextQuestion: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
    },
    no: {
      nextQuestion: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
    },
  },
});

module.exports = mongoose.model("Question", questionSchema);