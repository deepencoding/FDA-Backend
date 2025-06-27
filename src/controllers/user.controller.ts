import type { Request, Response } from "express";
import { getErrorMessage } from '../utils/errors'
import * as userService from '../services/user.service';

export const loginOne = async (req: Request, res: Response): Promise<void> => {
  try {
    const userToken = await userService.login(req.body);
    res.status(200).json({
      success: true,
      data: {
        token: userToken,
      }
    });
  } catch(error) {
    res.status(403).json({
      success: false,
      message: getErrorMessage(error)
    });
  };
};

export const registerOne = async (req: Request, res: Response): Promise<void> => {
  try {
    const userToken = await userService.register(req.body);
    res.status(201).json({
      success: true,
      data: {
				token: userToken
      }
    });
  } catch(error) {
    res.status(500).json({
      success: false,
      message: getErrorMessage(error)
    });
  }
};
