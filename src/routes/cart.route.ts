import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import { addCart, getCart, updateCart } from "../controllers/cart.controller";

const router = Router();

router.use(auth);

/**
 * Request: {}
 */
router.get('/cart', getCart);

/**
 * Request: {
    restaurantId: number;
    items: [{ itemId: number; itemQuantity: number }];
    noteForRestaurant?: string;
    noteForDeliveryPartner?: string;
    deliveryType?: "standard" | "scheduled";
    scheduledDeliveryTime?: string;
	}
 */
router.post('/cart', addCart);

/**
 * Request: {
    restaurantId: number;
    items: [{ itemId: number; itemQuantity: number }];
    noteForRestaurant?: string;
    noteForDeliveryPartner?: string;
    deliveryType?: "standard" | "scheduled";
    scheduledDeliveryTime?: string;
	}
*/
router.put('/cart', updateCart);

/**
 * Response: {
 * 	success: true,
 * 	data: {
			restaurant: {
				name: string;
				address: string
			} | null;
			cartItemCount: number;
			noteForRestaurant: string | undefined;
			noteForDeliveryPartner: string | undefined;
			deliveryType: "standard" | "scheduled" | undefined;
			scheduledDeliveryTime: string | undefined;
			subtotal: number | undefined;
			items: [
				{
					itemId: number,
					itemName: string,
					itemImage: string,
					quantity: number
				}
			];
		}
 * }
 */

export const cartRouter = router;
