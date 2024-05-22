const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController");

// Route to build individual item view
router.get("/type/:classificationId", invController.buildByIndividual);

module.exports = router;