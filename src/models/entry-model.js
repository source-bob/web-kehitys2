// Note: db functions are async and must be called with await from the controller
// How to handle errors in controller?
import promisePool from '../utils/database.js';

const changeEntryById = async (id, entry) => {
  const { entry_date, mood, weight, sleep_hours, notes } = entry;
  const sql = `UPDATE diaryentries
                SET entry_date = "${entry_date}", mood = "${mood}", weight = ${weight}, sleep_hours = ${sleep_hours}, notes = "${notes}"
                WHERE entry_id = ${id}`;
    
    try {
        const newNote = await promisePool.query(sql);
        return {new_note: newNote};
    } catch (e) {
        console.error('error', e.message);
        return {error: e.message};
    }
};

const listAllEntries = async () => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM DiaryEntries');
    console.log('rows', rows);
    return rows;
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

const findEntryById = async (id) => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM DiaryEntries WHERE entry_id = ?', [id]);
    console.log('rows', rows);
    return rows[0];
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

const addEntry = async (entry) => {
  const {user_id, entry_date, mood, weight, sleep_hours, notes} = entry;
  const sql = `INSERT INTO DiaryEntries (user_id, entry_date, mood, weight, sleep_hours, notes)
               VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [user_id, entry_date, mood, weight, sleep_hours, notes];
  try {
    const rows = await promisePool.query(sql, params);
    console.log('rows', rows);
    return {entry_id: rows[0].insertId};
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

/*const updateNote = async (id, note) => {
    const sql = `UPDATE diaryentries
                SET notes = '${note}'
                WHERE entry_id = ${id}`;
    
    try {
        const newNote = await promisePool.query(sql);
        return {new_note: newNote};
    } catch (e) {
        console.error('error', e.message);
        return {error: e.message};
    }
};*/

const deleteEntryById = async (id) => {
    const sql = `DELETE FROM diaryentries
                WHERE entry_id = ${id}`;
    try {
        const response = await promisePool.query(sql);
        return {entry_deleted: response};
    } catch (e) {
        console.error('error', e.message);
        return {error: e.message};
    }
};

const selectEntriesByUserId = async (userId) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT * FROM DiaryEntries WHERE user_id=?',
      [userId],
    );
    console.log(rows);
    return rows;
  } catch (error) {
    console.error(error);
    throw new Error('database error');
  }
};

export { listAllEntries, findEntryById, addEntry, deleteEntryById, selectEntriesByUserId, changeEntryById };