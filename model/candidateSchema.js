const mongoose = require("mongoose")

const candidateSchema = new mongoose.Schema({
    candidateName:String,
    candidateImg:String,
    candidateID:String,
    electionID:String,
},
{
    collection:'candidateCollection'
})

module.exports = mongoose.model('candidateCollection',candidateSchema)

