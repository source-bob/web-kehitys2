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
import { validationErrorHandler } from '../middlewares/error-handler.js';

const userRouter = express.Router();



userRouter.route('/')
    .get(authenticateToken, getUsers)
    .post(authenticateToken,
        body('email').trim().isEmail(),
        body('username').trim().isLength({min: 3, max: 20}).isAlphanumeric(),
        body('password').trim().isLength({min: 8}),
        validationErrorHandler,
        newUser
    )
    .put(authenticateToken,
        body('email').trim().isEmail(),
        body('username').trim().isLength({min: 3, max: 20}).isAlphanumeric(),
        body('password').trim().isLength({min: 8}).isAlphanumeric(),
        validationErrorHandler,
        changeUserData)
    
userRouter.route('/:id')    
    .get(getUserByID)
    .post(login)
    .put(authenticateToken,
        body('email').trim().isEmail(),
        body('username').trim().isLength({min: 3, max: 20}).isAlphanumeric(),
        body('password').trim().isLength({min: 8}).isAlphanumeric(),
        validationErrorHandler,
        editUserByID)
    .delete(authenticateToken, deleteUser);

export default userRouter;