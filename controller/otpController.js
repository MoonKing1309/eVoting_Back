const OTP = require('../model/otpSchema')
const voterCollection = require("../model/voterSchema")
const crypto = require('crypto');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


const generateOTP = async (req, res) => {
    const { voterID } = req.params;

    try {
        let phoneNumber = await voterCollection.findOne({voterID}).phoneNumber;
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
            fron: '+13133073607',
            to: `${phoneNumber}`
        })

            .then(message => console.log(message.sid));

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error generating OTP', error: error.message });
    }
};

const verifyOTP = async (req, res) => {
    const {voterID} = req.params;
    const { finalOtp } = req.body;
    try {
        const otpRecord = await OTP.findOne({ voterID, finalOtp });
        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid OTP or OTP expired' });
        }
        res.status(200).json({ message: 'OTP verified successfully' });
        await OTP.deleteOne({ _id: otpRecord._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error verifying OTP', error: error.message });
    }
};

module.exports = {
    generateOTP,
    verifyOTP,
};


