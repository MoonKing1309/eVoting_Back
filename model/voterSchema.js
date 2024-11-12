const mongoose = require('mongoose')

const voterSchema = new mongoose.Schema({
    voterID:{
        type:String,
        unique:true,
    },
    voterPwd:{
        type:String,
        default:'password'
    },
    phoneNumber:String,
    electionClearance:Number,
},{
    collection:'voterCollection'
})


module.exports = mongoose.model('voterCollection',voterSchema)