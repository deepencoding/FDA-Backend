import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import { getCart } from "../controllers/cart.controller";

const router = Router();

router.use(auth);
router.get('/cart', getCart);

export const cartRouter = router;
