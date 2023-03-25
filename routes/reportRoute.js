import express from "express";
import {
  addRecord,
  generateServiceReport,
} from "../controllers/reportController.js";
const router = express.Router();

router.route("/addRecord/:id").post(addRecord);
router.route("/allReports").get(generateServiceReport);

export default router;
