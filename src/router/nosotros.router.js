const express = require("express");
const NosotrosController = require("../controller/nosotros.controller")

const router = express.Router();

router.get("/nosotros",NosotrosController.nosotros)

module.exports = router;
