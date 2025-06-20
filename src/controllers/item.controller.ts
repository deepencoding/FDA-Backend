import type { Request, Response } from "express";
import { getErrorMessage } from '../utils/errors';
import * as itemService from '../services/item.service';

export const getMenuItem = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.params.id) {
      res.status(400).json({
        success: false,
        message: 'Menu item id not found.'
      });
      return;
    }
    const itemId = parseInt(req.params.id);
    const data = await itemService.getMenuItemById(itemId);

    res.status(200).json({
      success: true,
      data
    });
  } catch (error: any) {
    res.status(error.status || 500).json({
      success: false,
      message: getErrorMessage(error)
    });
  }
}; 