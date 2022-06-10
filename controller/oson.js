const User = require('../model/user')
const Journal = require('../model/journal')
const { oson_token, merchant_id } = require('../config/config')
const { v4: uuidv4 } = require('uuid');
const md5 = require('md5')
const axios = require('axios');

exports.createPayment = async (req, res, next) => {
    const { token, authorization } = req.headers
    const { amount, method } = req.body
    if (method == "pay") {
        if (!authorization || authorization == "") {
            res.json({
                "success": false,
                "state": 3,
                "message": "Account not found"
            })
        } else {
            if (!token || token == "") {
                res.json({
                    "success": false,
                    "state": 4,
                    "message": "Token not found"
                })
            }
            else {

                const base64Url = authorization.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                const decodeToken = JSON.parse(jsonPayload);
                const userMe = decodeToken.user


                // Foydalanuvchini tekshirish
                await User.findById({ _id: userMe._id }).exec((error, data) => {
                    if (error) {
                        res.json({
                            "success": false,
                            "state": 3,
                            "message": "Account not found"
                        })
                    } else {
                        if (amount < 999) {
                            res.json({
                                "success": false,
                                "state": 5,
                                "message": "Amount is less from minimum"
                            })
                        }
                        else {
                            const transactionID = Math.floor(Math.random() * 10000000000000000000000000000000)
                            axios({
                                url: "https://api.oson.uz/api/invoice/create",
                                method: "POST",
                                headers: {
                                    "Accept": "application/json",
                                    "Content-Type": "application/json",
                                    "token": token
                                },
                                data: {
                                    "merchant_id": merchant_id,
                                    "transaction_id": transactionID,
                                    "phone": "+998987654321",
                                    "user_account": userMe.email,
                                    "amount": amount,
                                    "currency": "UZS",
                                    "comment": "Оплата заказа N-1",
                                    "return_url": "https://www.ivi.ru",
                                    "lifetime": 30,
                                    "lang": "ru"
                                }
                            }).then((response) => {
                                const data = response.data
                                res.json(data)
                            })
                        }

                    }
                })
            }
        }
    } else {
        res.json({
            "success": false,
            "message": "Method is not defined"
        })
    }
}

exports.checkPaymentStatus = async (req, res, next) => {
    const { token, authorization } = req.headers
    const { transactionID, method } = req.body
    if (method == "check_status") {
        if (!authorization || authorization == "") {
            res.json({
                "success": false,
                "state": 3,
                "message": "Account not found"
            })
        } else {
            if (!token || token == "") {
                res.json({
                    "success": false,
                    "state": 4,
                    "message": "Token not found"
                })
            }
            else {

                const base64Url = authorization.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                const decodeToken = JSON.parse(jsonPayload);
                const userMe = decodeToken.user


                // Foydalanuvchini tekshirish
                await User.findById({ _id: userMe._id }).exec((error, data) => {
                    if (error) {
                        res.json({
                            "success": false,
                            "state": 3,
                            "message": "Account not found"
                        })
                    } else {
                        axios({
                            url: "https://api.oson.uz/api/invoice/status",
                            method: "POST",
                            headers: {
                                "Accept": "application/json",
                                "Content-Type": "application/json",
                                "token": token
                            },
                            data: {
                                "merchant_id": merchant_id,
                                "transaction_id": transactionID,
                            }
                        }).then((response) => {
                            const data = response.data
                            res.json(data)
                        })
                    }
                })
            }
        }
    } else {
        res.json({
            "success": false,
            "message": "Method is not defined"
        })
    }
}

exports.reversePayment = async (req, res, next) => {
    const { token, authorization } = req.headers
    const { transactionID, method } = req.body
    if (method == "reverse") {
        if (!authorization || authorization == "") {
            res.json({
                "success": false,
                "state": 3,
                "message": "Account not found"
            })
        } else {
            if (!token || token == "") {
                res.json({
                    "success": false,
                    "state": 4,
                    "message": "Token not found"
                })
            }
            else {

                const base64Url = authorization.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                const decodeToken = JSON.parse(jsonPayload);
                const userMe = decodeToken.user


                // Foydalanuvchini tekshirish
                await User.findById({ _id: userMe._id }).exec((error, data) => {
                    if (error) {
                        res.json({
                            "success": false,
                            "state": 3,
                            "message": "Account not found"
                        })
                    } else {
                        axios({
                            url: "https://api.oson.uz/api/invoice/reverse",
                            method: "POST",
                            headers: {
                                "Accept": "application/json",
                                "Content-Type": "application/json",
                                "token": token
                            },
                            data: {
                                "merchant_id": merchant_id,
                                "transaction_id": transactionID,
                            }
                        }).then((response) => {
                            const data = response.data
                            res.json(data)
                        })
                    }
                })
            }
        }
    } else {
        res.json({
            "success": false,
            "message": "Method is not defined"
        })
    }
}

