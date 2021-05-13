const mongoose = require('mongoose');

const id = mongoose.Schema.ObjectId;

const noteSchema = mongoose.Schema({
  date: Date,
  note: String,
  child: {
    _id: id,
  },
  parent: {
    _id: id,
  },
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);
