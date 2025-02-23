import express from 'express';
import {
    newUser,
    deleteUser,
    editUserByID,
    getUserByID,
    getUsers,
    login,
} from '../controllers/user-controller.js';
import { authenticateToken } from '../middlewares/authentication.js';

const userRouter = express.Router();



userRouter.route('/')
    .get(authenticateToken, getUsers)
    .post(newUser)
    
userRouter.route('/:id')    
    .get(getUserByID)
    .post(login)
    .put(editUserByID)
    .delete(deleteUser);

export default userRouter;