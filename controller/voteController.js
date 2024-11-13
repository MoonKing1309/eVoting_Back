const voteCollection = require('../model/voteSchema')
const candidateCollection = require('../model/candidateSchema')


const castVote = async (req,res)=>{
    try{
        const {voterID,electionID} = req.params;
        let alreadyVoted = false
        await voteCollection.findOne({voterID:voterID,electionID:electionID}).then((temp)=>{
            if(temp!=null){
                alreadyVoted = true;     
            }
        })
        const {candidateID} = req.body;
        if(alreadyVoted){
            return res.status(501).json({success:false,msg:"Already Voted in this election!"})
        }
        await voteCollection.create({candidateID:candidateID,electionID:electionID,voterID:voterID})
            .then(()=>res.status(200).json({success:true,msg:'Vote Cast Successfully'}))
            .catch(()=>res.status(500).json({success:false,msg:"Not cleared to Vote!"}))
    }
    catch(error){
        console.log(error)
        // return res.status(405).json({ success: false, msg: error })
    }
}

const countVote = async (req,res)=>{
    try{
        let {electionID} = req.params;
        let candidateDetails = await candidateCollection.find({electionID:electionID})
        let data = await voteCollection.aggregate([{$match:{electionID:electionID}},{$group:{_id:"$candidateID",votes:{$sum:1}}},{$project: {_id: 0,candidateID: "$_id",votes: 1,}}])
        console.log(data)
        return res.status(200).json(data)
    }
    catch(error){
        console.log(error)
        return res.status(500).json({ success: false, msg: error })
    }
}

module.exports={
    castVote,
    countVote,
}