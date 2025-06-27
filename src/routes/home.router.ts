import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import { getHomePageData } from "../controllers/home.controller";

const router = Router();

router.use(auth);

/**
 * Request: {}
 * Response: {
		success : true,
    data : {
			couponView: Coupon[];
			restaurantList: Restaurant[];
		}
	}
 * Coupon: {
    couponId : String?,
    discountAmount: String?,
    description: String?,
    logo: Int?
	}
 * Restaurant: {
    id : String?,
    name : String?,
    type : String?,
    rating : String?,
    image : Int?,
    deliveryFee : String
	}
 */
router.get('/home', getHomePageData);

export const homeRouter = router;