const express = require("express")
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
router.route('/account').put(voterUpdate)
router.route('/account/:voterID').get(voterFetch)
router.route('/admin/voters').get(votersFetch)

module.exports = router;