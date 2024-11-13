const express = require("express")
const excelUpload = require('../middleware/excelUpload'); 
const router = express.Router()

const {
    voterLogin,
    voterSignup,
    voterUpload,
    voterFetch,
    voterUpdate,
    votersFetch,
} = require("../controller/voterController.js")

router.route('/login').post(voterLogin)
router.route('/registerVoter').post(voterSignup)
router.route('/registerVoters').post(excelUpload,voterUpload)
router.route('/account/:voterID').put(voterUpdate)
router.route('/account/:voterID').get(voterFetch)
router.route('/admin/voters').get(votersFetch)

module.exports = router;
