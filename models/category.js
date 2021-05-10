const mongoose = require('mongoose');

const id = mongoose.Schema.ObjectId;

const categorySchema = mongoose.Schema({
  category: {
    type: String,
    unique: true,
  },
  active: Boolean,
  parent: {
    _id: id,
  },
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
