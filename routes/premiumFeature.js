const express = require('express');

const preiumFearureController = require('../controllers/premiumFeature');

const authenticatemiddleware = require('../Middleware/auth');

const router = express.Router();

router.get('/premium/showLeaderBoard',authenticatemiddleware.authenticate, preiumFearureController.getUserLeaderBoard);

module.exports = router;