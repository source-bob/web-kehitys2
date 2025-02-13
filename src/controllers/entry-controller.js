import {listAllEntries, findEntryById, addEntry, updateNote, deleteEntryById} from "../models/entry-model.js";

const getEntries = async (req, res) => {
  const result = await listAllEntries();
  if (!result.error) {
    res.json(result);
  } else {
    res.status(500);
    res.json(result);
  }
};

const getEntryById = async (req, res) => {
  const entry = await findEntryById(req.params.id);
  if (entry) {
    res.json(entry);
  } else {
    res.sendStatus(404);
  }
};

const postEntry = async (req, res) => {
  const {user_id, entry_date, mood, weight, sleep_hours, notes} = req.body;
  if (entry_date && (weight || mood || sleep_hours || notes) && user_id) {
    const result = await addEntry(req.body);
    if (result.entry_id) {
      res.status(201);
      res.json({message: 'New entry added.', ...result});
    } else {
      res.status(500);
      res.json(result);
    }
  } else {
    res.sendStatus(400);
  }
};

const putEntry = async (req, res) => {
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
};


const deleteEntry = async (req, res) => {
  const id = req.params.id
  console.log('delete entry by id', id);

  let entry = await findEntryById(id);

  if (entry) {
    const result = await deleteEntryById(id);
    console.log(`entry id ${id} deleted`, result);

    res.json({message: `entry id ${id} deleted onnistui`});
    res.status(200);
  } else {
    res
    .status(400)
    .json({message: 'invalid id, entry not found'});
  }
};

export {getEntries, getEntryById, postEntry, putEntry, deleteEntry};