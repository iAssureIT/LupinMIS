const express 	= require("express");
const router 	= express.Router();

const CenterRankingController = require('../controllers/center_ranking.js');

router.get("/:startDate/:endDate",CenterRankingController.getRanking);

module.exports = router;