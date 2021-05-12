const mongoose = require('mongoose');

const id = mongoose.Schema.ObjectId;

const userSchema = mongoose.Schema({
  parent: {
    name: String,
  },
  child: {
    name: String,
    age: Number,
    parent: {
      _id: id,
    },
  },
  username: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password: String,
  role: String,
  active: Boolean,
  avatar: String,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
