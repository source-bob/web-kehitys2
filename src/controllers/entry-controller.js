import {
  changeEntryById,
  listAllEntries,
  findEntryById,
  addEntry,
  deleteEntryById,
  selectEntriesByUserId
} from "../models/entry-model.js";
import { customError } from "../middlewares/error-handler.js";


const checkLevel = async (user) => {
  if (user === 'regular') {
    return false;
  } else if (user === 'admin') {
    return true;
  }
};


const getEntries = async (req, res, next) => {
  try {
    const entries = await listAllEntries();
    res.json(entries);
  } catch (e) {
    next(e);
  }
};

const getUserEntries = async (req, res) => {
  const enties = await selectEntriesByUserId(req.user.user_id);
  res.json(enties)
};

const getEntryById = async (req, res, next) => {
  const id = req.params.id;
  let check = checkLevel(req.user.user_level);
  try {
    const entry = await findEntryById(id);
    if (!entry) {
      return res.status(400).json({ message: 'invalid id, entry not found' });
    }

    if (check === false) {
      if (req.params.id !== req.user.user_id.toString()) {
        console.log(req.params.id, req.user.user_id);
        return res.status(403).json({ message: 'forbidden' })
      }
      const result = entry;
      return res.status(200).json({ message: `entry:`, result });
    }
    
  } catch (e) {
    next(e)
  }
  
};

const deleteEntry = async (req, res, next) => {
  const id = req.params.id;
  console.log('delete entry by id', id);

  const check = await checkLevel(req.user.user_level);
  console.log('USER CHECK:', check);

  try {
    let entry = await findEntryById(id);
    if (!entry) {
      return res.status(400).json({ message: 'invalid id, entry not found' });
    }
    
    if (check === false) {
      if (entry.user_id !== req.user.user_id) {
        console.log(req.user.user_id, entry.user_id);
        return res.status(403).json({message: 'Forbidden'});
      }

      const result = await deleteEntryById(id);
      console.log(`entry id ${id} deleted`, result);

      return res.status(200).json({ message: `entry id ${id} deleted` });
    }
  } catch (error) {
    next(customError(error.message, 400));
  }
};



const changeEntry = async (req, res, next) => {
  const entryId = req.params.id;
  const userId = req.user.user_id;
  const check = checkLevel(req.user.user_level);
  try {
    let entry = await findEntryById(entryId);
    if (!entry) {
      return res.status(400).json({ message: 'invalid id, entry not found' });
    }
    if (check === false) {
      if (entry.user_id !== userId) {
        return res.status(403).json({message: 'Forbidden'});
      }
    }
    const result = await changeEntryById(entryId, req.body);
    console.log(`entry id ${entryId} changed onnistui`);
    
    return res.status(200).json({ message: `entry id ${entryId} changed`, result });
    
  } catch (e) {
    next(customError(e.message, 400));
  }
};

const postEntry = async (req, res, next) => {
  // user_id, entry_date, mood, weight, sleep_hours, notes
  const newEntry = req.body;
  const check = checkLevel(req.user.user_level);
  if (check === false) {
    newEntry.user_id = req.user.user_id;
  };
  console.log('USER:', req.user);
  try {
    await addEntry(newEntry);
    res.status(201).json({message: "Entry added."});
  } catch (e) {
    next(customError(e.message, 400));
  }
};


/*const putEntry = async (req, res) => {
  console.log('change note by id', req.params.id);
  const id = req.params.id;

  let entry = await findEntryById(id);
  let note = req.body.note;
  if (entry && note) {
    const result = await updateNote(id, note);
    console.log(`entry id ${id} note changed`, result);

    res.json({message: `note changed for entry id ${id}`, new_note: note});
    res.status(200);
  } else {
    res
    .status(400)
    .json({message: 'invalid request: correct id and new note is required'});
  }
};*/

export { getEntries, getEntryById, postEntry, deleteEntry, getUserEntries, changeEntry };