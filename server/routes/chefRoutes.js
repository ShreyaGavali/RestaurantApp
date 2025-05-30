import express from "express";
const router = express.Router();
import {
  getChefs,
  addChef,
  updateChef,
  deleteChef,
  getChefCount
} from "../controllers/chefController.js";

router.get("/", getChefs);
router.get("/count", getChefCount)
router.post("/", addChef);
router.put("/:id", updateChef);
router.delete("/:id", deleteChef);

export default router;
