const express = require("express")
const router = express.Router()

const {
    candidateSignup,
    candidateFetch,
    candidatesFetch
} = require("../controller/candidateController.js")

router.route('/registerCandidate').post(candidateSignup)
router.route('/elections/:voterID/:electionID').get(candidateFetch)
router.route('/admin/candidates').get(candidatesFetch)

module.exports = router;
