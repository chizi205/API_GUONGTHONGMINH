const express = require("express");
const router = express.Router();
const kioskAuth = require("../../middleware/authKiosk");
const controller = require("../../controllers/kiosk/catalog.controller");

router.get("/me/categories", kioskAuth, controller.myCategories);
router.get("/me/products", kioskAuth, controller.productsByCategory);

module.exports = router;
