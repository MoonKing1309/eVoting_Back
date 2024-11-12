const express = require("express")
const router = express.Router()

const {
    generateOTP,
    verifyOTP,
} = require("../controller/otpController.js")

router.route('/login/:voterID').get(generateOTP)
router.route('/login/:voterID').post(verifyOTP)


module.exports = router;
