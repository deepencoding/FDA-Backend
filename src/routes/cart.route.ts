import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import { getCart } from "../controllers/cart.controller";

const router = Router();

router.use(auth);

/**
 * Request: ()
 */
router.get('/cart', getCart);

/**
 * Request: (
    val restaurantId : String,
    val itemId : String,
    val itemQuantity : String,
	)
 */
// TODO: router.post('/cart', addCart);

/**
 * Request: (
    val restaurantId : String,
    val itemId : String,
    val itemQuantity : String
	)
 */
// TODO: router.put('/cart', updateCart);

/**
 * Response: (
    val data : CartData?,
    val success : Boolean?
	)
 * CartData: (
    val restaurantData : RestaurantData?,
    val cartItemCount : String?,
    val noteForRestaurant : String?,
    val noteForDeliveryPartner : String,
    val deliveryType : String,
    val scheduledDeliveryTime : String,
    val subtotal : String?,
    val itemData: List<ItemData>?
	)

 * ItemData: (
    val customizationQuestions: List<CustomizationQuestion>,
    val itemDescription: String,
    val itemId: String,
    val itemImage: String,
    val itemName: String,
    val itemPrice: String,
    val cartItemCount: String
	)
 */

export const cartRouter = router;
