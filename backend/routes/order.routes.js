import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import {
    createOrder,
    getMyOrders,
    getOrderDetails,
    adminGetOrders,
    adminUpdateOrder
} from "../controllers/order.controller.js";

const router = express.Router();

// User routes
router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/:id", protect, getOrderDetails);

// Admin routes
router.get("/admin/all", protect, authorize("admin"), adminGetOrders);
router.patch("/admin/:id", protect, authorize("admin"), adminUpdateOrder);

export default router;
