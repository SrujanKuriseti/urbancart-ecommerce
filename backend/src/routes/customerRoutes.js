// backend/src/routes/customerRoutes.js
console.log("Loaded customers routes!");

const express = require("express");
const router = express.Router();
const CustomerController = require("../controllers/customerController");
const { authenticateToken, authorizeRole } = require("../middleware/auth");

// Customer routes
router.get("/profile", authenticateToken, CustomerController.getProfile);
router.put("/profile", authenticateToken, CustomerController.updateProfile);
router.post("/addresses", authenticateToken, CustomerController.createAddress);
router.put(
  "/addresses/:addressId",
  authenticateToken,
  CustomerController.updateAddress
);

// Admin routes
router.get(
  "/",
  authenticateToken,
  authorizeRole("admin"),
  CustomerController.getAllCustomers
);

router.put(
  "/:customerId",
  authenticateToken,
  authorizeRole("admin"),
  CustomerController.updateCustomer
);

router.delete(
  "/:customerId",
  authenticateToken,
  authorizeRole("admin"),
  CustomerController.deactivateCustomer
);

router.post(
  "/:customerId/activate",
  authenticateToken,
  authorizeRole("admin"),
  CustomerController.activateCustomer
);

module.exports = router;
