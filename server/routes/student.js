import express from 'express';
import { getUsers, createUser, updateStudent, deleteUser} from '../controllers/user.js';
import auth from '../middleware/auth.js';

const router = express.Router();
    
router.get('/', getUsers);
router.post('/',auth, createUser);
router.patch('/:id', auth, updateStudent);
router.delete('/:id', auth, deleteUser);

export default router;