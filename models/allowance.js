const mongoose = require('mongoose');

const id = mongoose.Schema.ObjectId;

const allowanceSchema = mongoose.Schema({
  amount: Number,
  from: Date,
  to: Date,
  parent: {
    _id: id,
  },
  child: {
    _id: id,
  },
}, { timestamps: true });

module.exports = mongoose.model('Allowance', allowanceSchema);
