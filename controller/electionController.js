const electionCollection = require('../model/electionSchema')
const voterCollection = require("../model/voterSchema")
const cron = require('node-cron');

const electionCreation = async (req,res)=>{
    try{
        var {electionID,electionName,electionDate} = req.body;

        await electionCollection.create({electionDate:electionDate,electionID:electionID,electionName:electionName,isDone:false})
        .then((data)=>{res.status(200).json({sucess:true,msg:data})})
        .catch((err)=>{console.log(err)})
    }
    catch(err){console.log(err)}

}

const electionFetch = async (req,res)=>{
    try{
        var data;
        var {voterID} = req.params;
        let voterClearance;
        await voterCollection.findOne({voterID:voterID}).then((temp)=>{voterClearance=temp.data.electionClearance})
        await electionCollection.find({isDone:false,electionClearance:{$gte:voterClearance}})
        .then((temp)=>{
            data = temp;
        })
        if(data.length==0)
            res.status(202).json({success:true,msg:'No Elections Found'})
        res.status(200).json({sucess:true,msg:data})
    }
    catch(err){
        console.log(err)
    }
}
const electionsFetch = async (req,res)=>{
    try{
        var data;
        await electionCollection.find()
        .then((temp)=>{
            data = temp;
        })
        res.status(200).json({sucess:true,msg:data})
    }
    catch(err){
        console.log(err)
        res.status(405).json({ success: false, msg: err })
    }
}

const completedElections = async(req,res)=>{
    try{
        var data;
        await electionCollection.find({isDone:true})
        .then((temp)=>{
            data = temp;
        })
        res.status(200).json({sucess:true,msg:data})
    }
    catch(err){
        console.log(err)
        res.status(405).json({ success: false, msg: err })
    }
}

async function markElectionsDone() {
    try {
        const today = new Date();

        await Election.updateMany(
            { electionDate: { $lt: today }, isDone: false },
            { $set: { isDone: true } }
        );

    } catch (error) {
        console.error(error);
    } 
}

cron.schedule('0 0 * * *', () => {
    markElectionsDone();
});

module.exports ={
    electionCreation,
    electionFetch,
    electionsFetch,
    completedElections,
}