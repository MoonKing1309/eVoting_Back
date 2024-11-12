const mongoose = require("mongoose")

const electionSchema = new mongoose.Schema({
    electionID:{
        type:String,
        unique:true,

    },
    electionName:String,
    electionDate:Date,
    electionClearance:Number,
    isDone:Boolean,

},
{
    collection:'electionCollection'
})

module.exports = mongoose.model('electionCollection',electionSchema)

