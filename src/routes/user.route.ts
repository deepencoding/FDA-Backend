import { Router } from 'express';
import { loginOne, registerOne } from '../controllers/user.controller';

const router = Router();

router.post('/login', loginOne);
router.post('/register', registerOne);

export default router;
