const express = require("express");
const app = express();
const connection = require('./database/index')



// Middware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
connection()



app.use('/api/payment', require('./router/oson'));
app.use('/api/user', require('./router/user'));
app.get("*", (req, res) => { res.json('API is not found') })



app.listen(5000, () => {
    console.log("Server is running");
});
