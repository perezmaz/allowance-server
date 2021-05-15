const mongoose = require('mongoose');

const id = mongoose.Schema.ObjectId;

const categorySchema = mongoose.Schema({
  category: String,
  active: Boolean,
  parent: {
    _id: id,
  },
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
