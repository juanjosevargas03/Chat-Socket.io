const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ChatSchema = new Schema({
  nick: String,
  msg: String,
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("Chat", ChatSchema);
