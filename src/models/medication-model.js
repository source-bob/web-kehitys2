import promisePool from "../utils/database.js";

const listAllMedications = async () => {
    try {
        const [rows] = await promisePool.query('SELECT * FROM medications');
        console.log('medications:', rows);
        return rows;
    } catch (e) {
        console.error('error', e.message);
        return {error: e.message}
    }
};

const uploadMed = async (body) => {
    const {user_id, name, dosage, frequency, start_date, end_date} = body;
    const sql = `
                INSERT INTO medications (user_id, name, dosage, frequency, start_date, end_date)
                VALUES (?, ?, ?, ?, ?, ?)`;
    const params = [user_id, name, dosage, frequency, start_date, end_date];
    try {
        
        if (user_id && name && dosage && frequency && start_date && end_date) {
            
            const row = await promisePool.query(sql, params);

            console.log('operation:', row);
            return {medication_id: row[0].insertId};

        }
        return;
    } catch (e) {
        console.error('error', e.message);
        return {error: e.message};
    }
};

const getUsMedById = async (id) => {
    try {
        const [rows] = await promisePool.query(`SELECT * FROM medications WHERE user_id = ${id}`);
        if (rows) {
            console.log(`user id ${id} medications:`, rows);
            return rows;
        } else {
            return {message: 'users medication not found'};
        }
    } catch (e) {
        console.error('error', e.message);
        return {error: e.message};
    }
};

const getMedById = async (id) => {
    try {
      const [meds] = await promisePool.query('SELECT * FROM medications WHERE medication_id = ?', [id]);
      console.log('meds', meds);
      return meds[0];
    } catch (e) {
      console.error('error', e.message);
      return {error: e.message};
    }
  };

const deleteMedicationById = async (id) => {
    
    try {
        const med = await getMedById(id);
        if (med) {
            const delSql = `DELETE FROM medications WHERE medication_id = ${id}`;
            const response = await promisePool.query(delSql);
            console.log(`medication with id ${id} deleted`);
            return {medication_id: id, message: response};
        } else {
            return {medication_id: id, message: 'not found'};
        }
        
    } catch (e) {
        console.error('error:' ,e.message);
        return {error: e.message};
    }
};

const changingDosage = async (id, note) => {
    
    
    try {
        const med = await getMedById(id);
        if (med) {
            const sql = `UPDATE medications
                        SET dosage = "${note}"
                        WHERE medication_id = ${id}`;
            const result = await promisePool.query(sql);
            console.log(`medication with id ${id} dosage changed`);
            return {medication_id: id, message: result};
        } else {
            return {medication_id: id, message: 'not found'};
        }
        
    } catch (e) {
        console.error('error' ,e.message);
        return {error: e.message};
    }
};

export { listAllMedications, getUsMedById, uploadMed, deleteMedicationById, changingDosage };