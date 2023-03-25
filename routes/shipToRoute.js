import express from "express";
import { addShipTo } from "../controllers/shipToController.js";
const router = express.Router();

router.route("/client").post(addShipTo);

export default router;
