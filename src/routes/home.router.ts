import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import { getHomePageData } from "../controllers/home.controller";

const router = Router();

router.use(auth);
router.get('/home', getHomePageData);

export const homeRouter = router;