import type { Request, Response } from "express";
import type { CustomRequest } from "../middlewares/auth.middleware";
import { addCartData, fetchCartData, updateCartData } from "../services/cart.service";
import { getErrorMessage } from "../utils/errors";

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
      message: getErrorMessage(error)
    });
  };
}

export async function addCart(_req: Request, res: Response) {
	const req = _req as CustomRequest;
	try {
		await addCartData(req.user.id, req.body);
		await getCart(req, res);
	} catch(error) {
		console.error('Error adding cart: ', error);
		res.status(500).json({
			success: false,
			message: getErrorMessage(error)
		});
	}
}

export async function updateCart(_req: Request, res: Response) {
	const req = _req as CustomRequest;
	try {
		await updateCartData(req.user.id, req.body);
		await getCart(req, res);
	} catch (error) {
		console.error('Error updating cart: ', error);
		res.status(500).json({
			success: false,
			message: getErrorMessage(error)
		});
	}
}
