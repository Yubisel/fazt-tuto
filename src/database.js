/*jshint esversion: 6 */

const mongoose = require('mongoose');
const __c = console;

mongoose.connect('mongodb://localhost/fazt-tuto', {
   useCreateIndex: true,
   useNewUrlParser: true,
   useFindAndModify: false,
   useUnifiedTopology: true
})
    .then(db => __c.log('DB is connected'))
    .catch(db => __c.error(err));