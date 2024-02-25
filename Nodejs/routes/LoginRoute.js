import express  from "express";
import { checkUser, signIn
} from '../controllers/LoginController.js';

const router = express.Router();

router.post('/login', checkUser);
router.post('/signin',  signIn);

export default router;