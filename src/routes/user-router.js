import express from 'express';
import {
    newUser,
    deleteUser,
    changePasswordByID,
    getUserByID,
    getUsers,
    login,
} from '../controllers/user-controller.js';

const userRouter = express.Router();



userRouter.route('/')
    .get(getUsers)
    .post(newUser)
    
userRouter.route('/:id')    
    .get(getUserByID)
    .post(login)
    .put(changePasswordByID)
    .delete(deleteUser);

export default userRouter;