const mongoose = require('mongoose');

const connection = () => {
    mongoose
        .connect("mongodb://localhost:27017/payment", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        })
        .then(() => { console.log("Database in on") })
        .catch((error) => { console.log(error) })
}
module.exports = connection