import { fetchHomePageData } from '../services/home.service';
import type { Request, Response } from 'express';

export const getHomePageData = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await fetchHomePageData();
    res.status(200).json({
      success: true,
      data
    });
  } catch(error) {
    console.error('Error in home.controller: ', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  };
}