const mongoose = require('mongoose')

const voteSchema = new mongoose.Schema({
    voterID:String,
    electionID:String,
    candidateID:String,
},{
    collection:'voteCollection'
})


module.exports = mongoose.model('voteCollection',voteSchema)