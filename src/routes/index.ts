import { Router } from "express";
import Transaction from "./Transaction";

const router: Router = Router();

router.use("/transaction", Transaction);

export default router;
