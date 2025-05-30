import express from "express";
const router = express.Router();
import {
  getOrders,
  addOrder,
  updateOrderStatus,
  assignChefToOrder,
  deleteOrder,
  getTotalRevenue,
  getTotalOrders,
  getTotalClients,
  getOrderStats,
  getRevenueData
} from "../controllers/orderController.js";

router.get("/", getOrders);
router.get("/revenue", getTotalRevenue);
router.get("/totalorders", getTotalOrders);
router.get("/totalclients", getTotalClients);
router.get("/orderstatus", getOrderStats);
router.get("/revenuedailyweekly", getRevenueData);
router.post("/", addOrder);
router.put("/status/:id", updateOrderStatus);
router.put("/assign-chef/:id", assignChefToOrder);
router.delete("/:id", deleteOrder);

export default router;
