const express = require('express');

const router = express.Router();
const agreementController = require('../../Controllers/AgreementController')

router.get("/getAllAgreements", agreementController.getAllAgreements);
router.get("/getAgreementById/:id", agreementController.getAgreementById);

module.exports = router;