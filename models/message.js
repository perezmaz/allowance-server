const mongoose = require('mongoose');

const id = mongoose.Schema.ObjectId;

const messsageSchema = mongoose.Schema({
  message: String,
  from: {
    _id: id,
  },
  channel: String,
}, { timestamps: true });

module.exports = mongoose.model('Message', messsageSchema);
