import express from "express";
const router = express.Router();
import { getTables, addTable, updateTable, deleteTable, getAvailableTables, getReservedTables } from "../controllers/tableController.js";

router.get("/", getTables);
router.get("/available", getAvailableTables);
router.get("/reserved", getReservedTables);
router.post("/", addTable);
router.put("/:id", updateTable);
router.delete("/:id", deleteTable);

export default router;
