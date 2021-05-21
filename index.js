/* eslint-disable no-console */
const mongoose = require('mongoose');
const server = require('./server');
const { api, db } = require('./config');

mongoose.connect(
  `mongodb+srv://${db.USER}:${db.PASSWORD}@${db.HOST}/${db.DATABASE}?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  error => {
    if (error) {
      throw error;
    }
    console.log(`Conected to mongo ${db.HOST}/${db.DATABASE}`);
  },
);

server.listen(api.PORT, () => {
  console.log(`API listen on ${api.HOST}:${api.PORT}/api/${api.VERSION}`);
});
