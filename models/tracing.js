const mongoose = require('mongoose');

const id = mongoose.Schema.ObjectId;

const tracingSchema = mongoose.Schema({
  activities: [
    {
      _id: id,
      activity: String,
      basePercent: Number,
      baseAmount: Number,
      tracingPercent: Number,
      realAmount: Number,
      category: {
        category: String,
      },
    },
  ],
  date: Date,
  amount: Number,
  realAmount: Number,
  comments: String,
  feedback: String,
  child: {
    _id: id,
    name: String,
    age: Number,
    avatar: String,
  },
  parent: {
    _id: id,
  },
}, { timestamps: true });

module.exports = mongoose.model('Tracing', tracingSchema);
