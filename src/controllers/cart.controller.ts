import type { Request, Response } from "express";
import type { CustomRequest } from "../middlewares/auth.middleware";
import { fetchCartData } from "../services/cart.service";

export async function getCart(_req:Request, res: Response) {
  const req = _req as CustomRequest;
  try {
    const cartData = await fetchCartData(req.user.id);

    res.status(200).json({
      success: true,
      data: cartData
    });
  } catch(error) {
    console.error('Error fetching cart: ', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  };
}