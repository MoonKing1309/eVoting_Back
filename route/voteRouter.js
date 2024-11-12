const express = require("express")
const router = express.Router()

const {
    castVote,
    countVote,
} = require("../controller/voteController.js")

router.route('/election/:voterID/:electionID').post(castVote)
router.route('/results/:electionID').get(countVote)


module.exports = router;
