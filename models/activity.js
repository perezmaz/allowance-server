const mongoose = require('mongoose');

const id = mongoose.Schema.ObjectId;

const activitySchema = mongoose.Schema({
  activity: String,
  percent: Number,
  active: Boolean,
  description: String,
  category: {
    _id: id,
  },
  child: {
    _id: id,
  },
  parent: {
    _id: id,
  },
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);
