import { Router } from 'express';
import { getMenuItem } from '../controllers/item.controller';

const router = Router();

// Public route to get a menu item
router.get('/menu-items/:id', getMenuItem);

export const itemRouter = router; 