import type { Request, Response } from "express";
import { getErrorMessage } from '../utils/errors'
import * as userService from '../services/user';
import type { CustomRequest } from '../middlewares/auth';

export const loginOne = async (req: Request, res: Response): Promise<void> => {
  try {
    const foundUser = await userService.login(req.body);
    res.status(200).send(foundUser);
  } catch(error) {
    res.status(500).send(getErrorMessage(error));
  };
};

export const registerOne = async (req: Request, res: Response): Promise<void> => {
  try {
    await userService.register(req.body);
    res.status(201).send('User registered Succesfully');
  } catch(error) {
    res.status(500).send(getErrorMessage(error));
  }
};
