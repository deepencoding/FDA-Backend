import { sql } from "bun";
import type { Coupon } from "..";

export async function getActiveCoupons(): Promise<Coupon[]> {
  return await sql`
    SELECT
      id AS "couponId",
      discount_amount AS "discountAmount",
      description,
      logo_url AS "logo"
    FROM coupons
    WHERE is_active = TRUE
  ` as Coupon[];
}