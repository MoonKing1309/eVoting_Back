const OTP = require('../model/otpSchema')
const voterCollection = require("../model/voterSchema")
const crypto = require('crypto');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


const generateOTP = async (req, res) => {
    const { voterID } = req.params;
    try {
        let phoneNumber;
        await voterCollection.findOne({voterID}).then((temp)=>{phoneNumber=temp.phoneNumber})
        const otp = crypto.randomInt(100000, 999999).toString();
        const existingOTP = await OTP.findOne({ voterID });
        if (existingOTP) {
            existingOTP.otp = otp;
            existingOTP.timestamp = Date.now();
            await existingOTP.save();
        } else {
            const newOTP = new OTP({
                otp,
                voterID,
            });
            await newOTP.save();
        }

        client.messages.create({
            body: `Your OTP for the E-Voting-System is ${otp} . Expires in 300 seconds.`,
            from: '+13133073607',
            to: `+ 91 ${phoneNumber}`
        })

        res.status(200).json({ success:true,msg: 'OTP sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ sucess:false,msg: 'Error generating OTP'});
    }
};

const verifyOTP = async (req, res) => {
    const {voterID} = req.params;
    const { finalOtp } = req.body;
    try {
        const otpRecord = await OTP.findOne({ voterID });
        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid OTP or OTP expired' });
        }
        res.status(200).json({ success:true,msg: 'OTP verified successfully' });
        await OTP.deleteOne({ _id: otpRecord._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({sucess:false,msg:'Error verifying OTP' });
    }
};

module.exports = {
    generateOTP,
    verifyOTP,
};


