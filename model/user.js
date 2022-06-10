const mongoose = require('mongoose')
const bcrypt = require("bcryptjs");
const User = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please add a valid email ",
        ],
        unique: [true, "Your email has already been registered"],
        required: true

    },
    password: {
        type: String,
        required: [true, "Please add a password"],
    },
    uid: {
        type: String,
        required: [true, "Please add a uid"],
    },
    balance: {
        type: Number, default: 0
    }
}, {
    timestamps: true
})


User.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});



module.exports = mongoose.model('user', User)