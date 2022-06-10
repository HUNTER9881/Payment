const mongoose = require('mongoose')

const JournalSchema = mongoose.Schema({
    userID: { type: mongoose.Schema.ObjectId, ref: "user", required: true },
    system: { type: String, required: true },
    amount: { type: Number, required: true },
    transaction_id: { type: String },
    pay_url: { type: String }
}, { timestapms: true })


// Jurnalga yozilgan paytda userni balansini ustiga qoshib yoqvoradi
JournalSchema.pre("save", async function (req, res, next) {
    const user = await this.model("user").findByIdAndUpdate(this.userID)
    user.balance += this.amount
    user.save({ validateBeforeSave: false })
    next()
})
module.exports = mongoose.model("journal", JournalSchema)