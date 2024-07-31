import { Router } from 'express';
import { getUsersController, getUserByIdController } from '../controllers/userController';

const router = Router();

router.get('/users', getUsersController);
router.get('/users/:id', getUserByIdController);

export default router;
