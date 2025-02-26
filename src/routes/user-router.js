import express from 'express';
import {body} from 'express-validator';
import {
    newUser,
    deleteUser,
    editUserByID,
    getUserByID,
    getUsers,
    login,
    changeUserData,
} from '../controllers/user-controller.js';
import { authenticateToken } from '../middlewares/authentication.js';

const userRouter = express.Router();



userRouter.route('/')
    .get(authenticateToken, getUsers)
    .post(
        body('email').trim().isEmail(),
        body('username').trim().isLength({min: 3, max: 20}).isAlphanumeric(),
        body('password').trim().isLength({min: 8}),
        newUser
    )
    .put(authenticateToken, changeUserData)
    
userRouter.route('/:id')    
    .get(getUserByID)
    .post(login)
    .put(editUserByID)
    .delete(deleteUser);

export default userRouter;