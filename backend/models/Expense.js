const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },

    title: {
      type: String,
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    type: {
      type: String,
      enum: ["income", "expense"],
      required: true
    },

    category: {
      type: String,
      required: true
    },

    date: {
      type: String,
      required: true
    },

    note: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);