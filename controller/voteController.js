const voteCollection = require('../model/voteSchema')
const candidateCollection = require('../model/candidateSchema')


const castVote = async (req,res)=>{
    try{
        const {voterID,electionID} = req.params;
        const {candidateID} = req.body;
            await voteCollection.create({candidateID:candidateID,electionID:electionID,voterID:voterID}).then(()=>{
                res.status(200).json({success:true,msg:'Vote Cast Successfully'})
            })
        res.status(500).json({success:false,msg:"Not cleared to Vote!"})
    }
    catch(error){
        console.log(error)
        res.status(405).json({ success: false, msg: error })
    }
}

const countVote = async (req,res)=>{
    try{
        let {electionID} = req.params;
        let data = await voteCollection.aggregate([{$match:{electionID:electionID}},{$group:{_id:"$candidateID",votes:{$sum:1}}},{$lookup: {from: "candidateCollection", localField: "candidateID",foreignField: "candidateID", as: "candidateDetails"}},{ $unwind: "$candidateDetails" },{$project: {_id: 0,candidateID: "$_id",votes: 1,candidateImg: "$candidateDetails.candidateImg"}}])
        res.status(200).json(data)
    }
    catch(error){
        console.log(error)
        res.status(500).json({ success: false, msg: error })
    }
}

module.exports={
    castVote,
    countVote,
}