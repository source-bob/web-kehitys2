import express from 'express';
import {
  getEntries,
  getEntryById,
  postEntry,
  putEntry,
  deleteEntry,
} from '../controllers/entry-controller.js';

const entryRouter = express.Router();

entryRouter.route('/').get(getEntries).post(postEntry);

entryRouter.route('/:id')
  .get(getEntryById)
  .put(putEntry)
  .delete(deleteEntry);

export default entryRouter;