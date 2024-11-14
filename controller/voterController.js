const voterCollection = require("../model/voterSchema")
const bcrypt = require("bcryptjs")
const xlsx = require('xlsx');
const fs = require('fs');

const voterLogin = async (req, res) => {
    try {
        const { voterID, pwd, phno } = req.body;
        let voterPwd = pwd
        let phnNo = phno
        var data;
        await voterCollection.findOne({ voterID: voterID })
            .then((temp) => {
                if (temp) {
                    data = temp
                }
            })
            .catch((error) =>
                console.log(error))
        if (!data)
            return res.status(403).json({ success: false, msg: "Username does not exists" })
        else {
            if (await bcrypt.compare(voterPwd, data.voterPwd)) {
                if (phnNo==data.phoneNumber)
                    return res.status(201).json({ success: true, msg: data._id })
                else
                    return res.status(402).json({ success: false, msg: "Phone number not Matched" })

            }
            else {
                return res.status(401).json({ success: false, msg: "Password not Matched" })
            }
        }
    } catch (error) {
        console.log(error)
        res.status(404).send()
    }
}

const voterSignup = async (req, res) => {
    try {
        const { voterID, voterPwd, phnNo ,electionClearance} = req.body;
        var data = false;
        const salt = await bcrypt.genSalt(3)
        const hashPwd = await bcrypt.hash(voterPwd, salt)

        await voterCollection.findOne({ voterID: voterID })
            .then((res) => {
                if (res) {
                    data = true
                }
            })
            .catch((error) =>
                console.log(error))
        if (data)
            return res.status(409).json({ success: false, msg: "VoterID already exists" })
        await voterCollection.findOne({ phoneNumber: phoneNumber })
        .then((res) => {
            if (res) {
                data = true
            }
        })
        .catch((error) =>
            console.log(error))
        if (data)
            return res.status(410).json({ success: false, msg: "PhoneNumber already exists" })
        else
            await voterCollection.create({ voterID: voterID, voterPwd: hashPwd, phoneNumber: phnNo,electionClearance:electionClearance }).then((res) => { console.log(res) }).catch((err) => console.log(err))
        res.status(201).json({ success: true, msg: "Account Created!" })
    } catch (error) {
        console.log(error)
        res.status(404).send()
    }
}

const voterUpload = async (req, res) => {
    try {

      const filePath = req.file.path;
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(sheet);
  
      const voters = data.map(row => ({
        voterID: row['Voter ID'],
        phoneNumber: row['Phone No'],
        electionClearance:row['Ele Cle']
      }));
  
      const existingVoterIds = await voterCollection.find({ voterID: { $in: voters.map(v => v.voterID) } }).select('voterID');
      const existingVoterIdsSet = new Set(existingVoterIds.map(v => v.voterID));
  
      const newVoters = voters.filter(voter => !existingVoterIdsSet.has(voter.voterID));
  
      if (newVoters.length === 0) {
        return res.status(400).json({ message: 'All provided voter IDs already exist in the system.' });
      }
  
      await voterCollection.insertMany(newVoters, { ordered: false });
  
      fs.unlinkSync(filePath);
      res.status(200).json({ message: `Voters added successfully!` });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error processing the file', error: error.message });
    }
  };


const voterFetch = async (req, res) => {
    const { voterID } = req.params;
    var data
    try {
        await voterCollection.findOne({ voterID: voterID })
            .then((temp) => {
                data = temp
            })
        return res.status(201).json({ success: true, msg: data })
    } catch (error) {
        console.log(error)
        res.status(405).json({ success: false, msg: error })
    }
}

const votersFetch = async(req,res)=>{
    try{
        var data;
        await voterCollection.find().then((temp)=>{
            data=temp
        });
        return res.status(200).json(data);

    }
    catch(error){
        console.log(error)
        res.status(405).json({ success: false, msg: error })

    }
}

const voterUpdate = async (req, res) => {
    const { voterID } = req.params;
    const { newPwd } = req.body;
    const hashPwd = await bcrypt.hash(newPwd, 3)
    try {
        await voterCollection.findOneAndUpdate({ voterID: voterID }, { voterPwd: hashPwd })
            .then(() => {
                res.status(201).json({ success: true })
            })

    } catch (error) {
        res.status(404).json({ success: false, msg: error })
    }
}

module.exports = {
    voterLogin,
    voterSignup,
    voterUpload,
    voterFetch,
    voterUpdate,
    votersFetch,


}



