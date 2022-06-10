const User = require("../model/user");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const config = require('../config/config')
const { v4: uuidv4 } = require('uuid');

exports.register = async (req, res, next) => {
    try {
        const user = await User.create({ ...req.body, uid: uuidv4() })
        await user.save()
        res.json(user)
    }
    catch (e) {
        res.json(e)
    }
};



exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password || email == "" || password == "") {
        res.json({ success: false, message: "Please provide email or password" });
    }
    else {
        const user = await User.findOne({ email: email }).select("password");
        if (!user || user == "" || user == undefined || user == null) {
            res.json("Email is wrong");
        }
        else {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch || isMatch == false) {
                res.json("Password is wrong");
            }
            else {
                const user_data = await User.findOne({ email: email })
                if (!user_data || user_data == "") {
                    res.json({
                        success: false,
                        message: "User data is not defined for session - 1",
                    });
                } else {
                    const token = JWT.sign(
                        {
                            user: user_data
                        },
                        config.jwt_key,
                        {
                            expiresIn: config.jwt_time
                        }
                    );
                    res.json({
                        message: "Success",
                        status: true,
                        token: token
                    })
                }
            }
        }
    }
};


exports.decodeToken = async (req, res, next) => {
    const token = req.headers.authorization
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const decodeToken = JSON.parse(jsonPayload);
    res.json(decodeToken)
};
