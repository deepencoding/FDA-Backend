import { Router } from 'express';
import { loginOne, registerOne } from '../controllers/user.controller';

const router = Router();

/**
 * Request: {
    phone_no: String,
    password: String
	}
 */
router.post('/login', loginOne);

/**
 * Request: {
    name : String,
    phone_no: String,
    password: String,
    role : UserType?
	}
 */
router.post('/register', registerOne);

/**
 * Response: {
		success: true,
		data: {
			token: string
		}
	}
*/

export const userRouter = router;
