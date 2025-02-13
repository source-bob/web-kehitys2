import promisePool from "../utils/database.js";

const getAllExercises = async () => {
    try {
        const [rows] = await promisePool.query('SELECT * FROM exercises');

        console.log('exercises:', rows);
        return rows;
    } catch (e) {
        console.error('error' ,e.message);
        return {error: e.message};
    }
};

const getExById = async (id) => {
    try {
      const [exs] = await promisePool.query('SELECT * FROM exercises WHERE exercise_id = ?', [id]);
      console.log('exs', exs);
      return exs[0];
    } catch (e) {
      console.error('error', e.message);
      return {error: e.message};
    }
};


const getUsExById = async (id) => {
    try {
        const [rows] = await promisePool.query(`SELECT * FROM exercises WHERE user_id = ${id}`);
        if (rows) {
            console.log(`user id ${id} exercises:`, rows);
            return rows;
        } else {
            return {message: 'users exercise not found'};
        }
    } catch (e) {
        console.error('error', e.message);
        return {error: e.message};
    }
};

const uploadEx = async (body) => {
    const {user_id, type, duration, intensity} = body;
    console.log(body);
    const sql = `
                INSERT INTO exercises (user_id, type, duration, intensity)
                VALUES (?, ?, ?, ?)`;
    const params = [user_id, type, duration, intensity];
    console.log(params);
    try {
        
        if (user_id && type && duration && intensity) {
            
            const row = await promisePool.query(sql, params);

            console.log('operation:', row);
            return {exercise_id: row[0].insertId};

        }
        return;
    } catch (e) {
        console.error('error', e.message);
        return {error: e.message};
    }
};

const deleteExerciseById = async (id) => {
    
    try {
        const exs = await getExById(id);
        if (exs) {
            const delSql = `DELETE FROM exercises WHERE exercise_id = ${id}`;
            const response = await promisePool.query(delSql);
            console.log(`exercise with id ${id} deleted`);
            return {exercise_id: id, message: response};
        } else {
            return {exercise_id: id, message: 'not found'};
        }
        
    } catch (e) {
        console.error('error:' ,e.message);
        return {error: e.message};
    }
};

const changingType = async (id, type) => {
    
    
    try {
        const exs = await getExById(id);
        if (exs) {
            const sql = `UPDATE exercises
                        SET type = "${type}"
                        WHERE exercise_id = ${id}`;
            const result = await promisePool.query(sql);
            console.log(`exercise with id ${id} type changed`);
            return {exercise_id: id, message: result};
        } else {
            return {exercise_id: id, message: 'not found'};
        }
        
    } catch (e) {
        console.error('error' ,e.message);
        return {error: e.message};
    }
};

export { getAllExercises, getUsExById, uploadEx, deleteExerciseById, changingType };