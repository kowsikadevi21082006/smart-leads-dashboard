import express from "express";
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  exportLeads,
} from "../controllers/leadController";
import { protect } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/roleMiddleware";

const router = express.Router();

router.use(protect);

router.post("/", createLead);
router.get("/", getLeads);
router.get("/export", exportLeads);
router.get("/:id", getLeadById);
router.put("/:id", updateLead);
router.delete("/:id", authorizeRoles("admin"), deleteLead);

export default router;
