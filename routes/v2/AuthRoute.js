const express = require('express');

const router = express.Router();
const AuthController = require('../../Controllers/AuthController')

router.get("/veiwDetails/walletAddress/:address", AuthController.viewUserDetailsByWalletAddress);

module.exports = router;