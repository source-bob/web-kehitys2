import express from 'express';
import {
  getEntryById,
  postEntry,
  putEntry,
  deleteEntry,
  getUserEntries,
} from '../controllers/entry-controller.js';
import { authenticateToken } from '../middlewares/authentication.js';

const entryRouter = express.Router();

entryRouter.route('/').get(authenticateToken, getUserEntries).post(authenticateToken, postEntry);

entryRouter.route('/:id')
  .get(authenticateToken, getEntryById)
  .put(putEntry)
  .delete(authenticateToken, deleteEntry);

export default entryRouter;