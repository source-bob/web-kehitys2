import express from 'express';
import { getExercises, findUsersExercises, uploadNewExercise, delExById, changeType } from '../controllers/exercises-controller.js';

const exerciseRouter = express.Router();

exerciseRouter.route('/').get(getExercises).post(uploadNewExercise);

exerciseRouter.route('/:id')
.get(findUsersExercises)
.delete(delExById)
.put(changeType);

export default exerciseRouter;