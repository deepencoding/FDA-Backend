import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import { getHomePageData } from "../controllers/home.controller";

const router = Router();

router.use(auth);
/**
 * Request: ()
 * Response: (
    val data : HomeData,
    val success : Boolean
	)
 * HomeData: (
    val couponView : List<CouponItem>,
    val restaurantList : List<RestaurantItem>
	)
 * CouponItem: (
    val couponId : String?,
    val discountAmount: String?,
    val description: String?,
    val logo: Int?
	)
 * RestaurantItem: (
    val id : String?,
    val name : String?,
    val type : String?,
    val rating : String?,
    val image : Int?,
    val deliveryFee : String
	)
 */
router.get('/home', getHomePageData);

export const homeRouter = router;