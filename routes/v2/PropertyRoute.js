const express = require('express');

const router = express.Router();
const propertyController = require('../../Controllers/propertyController')

router.get("/getProperty/:id", propertyController.getProperty);
router.get("/getAllProperties", propertyController.getAllProperties);
router.get("/getRecentlyProperties", propertyController.getRecentlyListedProperties);

module.exports = router;