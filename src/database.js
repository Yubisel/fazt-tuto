const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/fazt-tuto', {
   useCreateIndex: true,
   useNewUrlParser: true,
   useFindAndModify: false 
})
    .then(db => console.log('DB is connected'))
    .catch(db => console.error(err));