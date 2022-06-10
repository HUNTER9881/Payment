const mongoose = require('mongoose')
const this_schema = mongoose.Schema({
    user_account: { type: mongoose.Schema.ObjectId, ref: "user"},
    merchant_id: { type: Number, default: 1474 },
    transaction_id: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "UZS" },
    comment: { type: String, required: true },
    return_url: { type: String, default: "http://wwww.avlomedia.uz"},
    lifetime: { type: Number, default: 30 },
    lang: { type: String, default: "ru" },
}, { timestapms: true })

module.exports = mongoose.model("oson", this_schema)