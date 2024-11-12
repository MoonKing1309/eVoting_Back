const express = require("express")
const router = express.Router()

const {
    electionCreation,
    electionFetch,
    electionsFetch,
    completedElections,
} = require("../controller/electionController.js")

router.route('/registerElection').post(electionCreation)
router.route('/elections/:voterID').get(electionFetch)
router.route('/admin/elections').get(electionsFetch)
router.route('/results').get(completedElections)

module.exports = router;
