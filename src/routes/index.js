const express = require("express");
const router = express.Router();

// Admin chung (system)
router.use("/admin/auth", require("./admin/auth.routes"));
router.use("/admin/shops", require("./admin/shops.routes"));
router.use("/admin/kiosks", require("./admin/kiosks.routes"));

// Admin của shop (owner/staff)
router.use("/shop/auth", require("./shop/auth.routes"));
router.use("/shop/products", require("./shop/products.routes"));
router.use("/shop/categories", require("./shop/categories.routes"));
router.use("/shop/kiosks", require("./shop/kiosk.routes"));
router.use("/shop/staffs", require("./shop/staff.routes"));

// App Kiosk
router.use("/kiosk/auth", require("./kiosk/auth.routes"));
router.use("/kiosk", require("./kiosk/catalog.routes"));
router.use("/kiosk", require("./kiosk/tryon.routes"));
module.exports = router;
