const candidateCollection = require('../model/candidateSchema')
const mongoose = require('mongoose');

const candidateSignup = async (req,res)=>{
    try {
        const {candidateID,candidateName,electionID,candidateImg} = req.body;
        var data =false;
        await candidateCollection.findOne({candidateID:candidateID})
            .then((res)=>{
                if(res){
                    data=true
                    }
                })
            .catch((error)=>
                console.log(error))
        if(data)
            return res.status(409).json({success:false,msg:"Candidate already exists"})
        else
            await candidateCollection.create({candidateID:candidateID,candidateName:candidateName,electionID:electionID,candidateImg:candidateImg}).then((res)=>{console.log(res)}).catch((err)=>console.log(err))
        res.status(201).json({success:true,msg:"Account Created!"})
    } catch (error) {
        console.log(error)
        res.status(404).send()
    }
}



const candidateFetch = async (req,res)=>{
    const {electionID} = req.params;
    var data
    try {
        await candidateCollection.find({electionID:electionID})
            .then((temp)=>{
                data = temp
            }) 
        return res.status(201).json({success:true,msg:data})
    } catch (error) {
        console.log(error)
        res.status(405).json({success:false,msg:error})
    }
}

const candidatesFetch = async(req,res)=>{
    try{
        var data;
        await candidateCollection.find().then((temp)=>{
            data=temp
        }).catch((err)=>console.log(err))
        return res.status(200).json(data);
    }
    catch(error){
        console.log(error)
        res.status(405).json({ success: false, msg: error })
    }
}


module.exports = {
    candidateSignup,
    candidateFetch,
    candidatesFetch

}


