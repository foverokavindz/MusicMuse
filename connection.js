const mongoose = require('mongoose');
require('dotenv').config();

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.o2fwthp.mongodb.net/music-muse?retryWrites=true&w=majority`;

const connection = mongoose
  .connect(uri, connectionParams)
  .then(() => console.log('connected to mongo atlas'))
  .catch((err) => console.log(err));

module.exports = connection;
