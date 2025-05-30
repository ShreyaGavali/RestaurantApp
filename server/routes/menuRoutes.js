import express from "express";
const router = express.Router();
import {
  getMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getFilteredMenuItems
} from "../controllers/menuController.js";

router.get("/", getMenuItems);
router.post("/filter", getFilteredMenuItems);
router.post("/", addMenuItem);
router.put("/:id", updateMenuItem);
router.delete("/:id", deleteMenuItem);

export default router;
