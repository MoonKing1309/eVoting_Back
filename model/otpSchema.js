const mongoose = require("mongoose")

const otpSchema = new mongoose.Schema({
    otp:String,
    voterID:String,
    timestamp:{
        type:Date,
        default:Date.now,
        expires:'5m',
    },

},
{
    collection:'otpCollection'
})

module.exports = mongoose.model('otpCollection',otpSchema)

