import type { Coupon, Restaurant } from "..";
import { getActiveCoupons } from "../models/coupon.model";
import { getTopRestaurants } from "../models/restaurant.model";

type HomePage = {
  couponView: Coupon[];
  restaurantList: Restaurant[];
};

export async function fetchHomePageData(): Promise<HomePage> {
  const [restaurants, coupons] = await Promise.all([
    getTopRestaurants(),
    getActiveCoupons()
  ]);

  return {
    couponView: coupons.map(c => ({
      couponId: c.couponId,
      discountAmount: c.discountAmount,
      description: c.description,
      logo: c.logo
    })),
    restaurantList: restaurants.map(r => ({
      id: r.id,
      name: r.name,
      type: r.type,
      rating: r.rating,
      image: r.image,
			deliveryFee: r.deliveryFee
    }))
  };
}
