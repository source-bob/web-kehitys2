import express from 'express';
import {
  getEntryById,
  postEntry,
  changeEntry,
  deleteEntry,
  getUserEntries,
} from '../controllers/entry-controller.js';
import {body} from 'express-validator';
import { authenticateToken } from '../middlewares/authentication.js';
import { validationErrorHandler } from '../middlewares/error-handler.js'

const entryRouter = express.Router();

entryRouter.route('/')
  .get(authenticateToken, getUserEntries)
  .post(
    authenticateToken,
    body('mood').trim().isLength({min: 2, max: 20}).isAlphanumeric(),
    body('entry_date').trim().isDate(),
    body('weight').trim().isNumeric({min: 15, max: 150}),
    body('sleep_hours').trim().isNumeric({min: 0, max: 24}),
    body('notes').trim().escape().custom((value, {req}) => {
      console.log('custom validator', value);
      return !(req.body.mood === value);
    }),
    validationErrorHandler,
    postEntry
  );

entryRouter.route('/:id')
  .get(authenticateToken, getEntryById)
  .put(authenticateToken,
    body('mood').trim().isLength({min: 2, max: 20}).isAlphanumeric(),
    body('entry_date').trim().isDate(),
    body('weight').trim().isNumeric({min: 15, max: 150}),
    body('sleep_hours').trim().isNumeric({min: 0, max: 24}),
    body('notes').trim().escape().custom((value, {req}) => {
      console.log('custom validator', value);
      return !(req.body.mood === value);
    }),
    validationErrorHandler,
    changeEntry)
  .delete(authenticateToken, deleteEntry);

export default entryRouter;