import { Router } from 'express';
import { loginOne, registerOne } from '../controllers/user';

const router = Router();

router.post('/login', loginOne);
router.post('/register', registerOne);

export default router;

// router.get('/all', auth, searchController.getAll);
// router.post('/', auth, searchController.addOne);
// router.delete('/:id', auth, searchController.deleteOne);
