import Express from "express";
import { getUser,UpdateUser } from "../controllers/user.js";

const router = Express.Router();
  
router.get("/find/:userId",getUser)
router.put("/",UpdateUser)

export default router