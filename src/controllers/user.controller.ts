import type { Request, Response } from "express";
import { getErrorMessage } from '../utils/errors'
import * as userService from '../services/user.service';

export const loginOne = async (req: Request, res: Response): Promise<void> => {
  try {
    const foundUser = await userService.login(req.body);
    res.status(200).json({
      success: true,
      data: {
        foundUser,
        message: 'User logged in succesfully'
      }
    });
  } catch(error) {
    res.status(500).json({
      success: false,
      messgae: getErrorMessage(error)
    });
  };
};

export const registerOne = async (req: Request, res: Response): Promise<void> => {
  try {
    await userService.register(req.body);
    res.status(201).json({
      success: true,
      data: {
        message: 'User registered Succesfully'
      }
    });
  } catch(error) {
    res.status(500).json({
      success: false,
      message: getErrorMessage(error)
    });
  }
};
