import promisePool from '../utils/database.js';



const selectAllUsers = async () => {
    try {
        const [users] = await promisePool.query(
            'SELECT user_id, username, email, created_at, user_level FROM Users'
        );
        return users;
    } catch (e) {
        console.error('error', e.message);
        return {error: e.message};
    }
};

const changeUserById = async (id, data) => {
    try {
        const { username, password, email } = data;
        const sqlQuery = `
        UPDATE users
        SET username = ?, password = ?, email = ?
        WHERE user_id = ?`;

        const values = [username, password, email, id];
        const [result] = await promisePool.query(sqlQuery, values);

        return { updated: result.affectedRows > 0 };
    } catch (e) {
        console.error('error', e.message);
        return {error: e.message};
    }
};

const findUserById = async (id) => {
    try {
        const [user] = await promisePool.query(
            'SELECT * FROM Users WHERE user_id = ?', [id]
        );
        console.log('user', user[0]);
        return user[0];
    } catch (e) {
        console.error('error', e.message);
        return {error: e.message};
    }
};

const addUser = async (entry) => {
    const {username, password, email, user_level} = entry;
    const sql = `INSERT INTO Users (username, password, email, user_level)
                VALUES (?, ?, ?, ?)`;
    const params = [username, password, email, user_level];
    try {
        const [result] = await promisePool.query(sql, params);
        console.log('result', result);

        if (result.affectedRows === 1) {
            console.log('user now in database');
            return { user: entry };
        } else {
            return { error: 'user was not inserted' };
        }
        
    } catch (e) {
        console.error('error', e.message);
        return {error: e.message};
    }
};

const changePassByID = async (id, pass) => {
    const sql = `UPDATE users
                SET password = '${pass}'
                WHERE user_id = ${id}`;
    try {
        const users = await promisePool.query(sql);
        console.log('users', users[0]);
        return {user_id: id, message: 'pass changed', new_pass: pass};
    } catch (e) {
        console.error('error', e.message);
        return {error: e.message};
    }
};

const resetAutoIncrement = async () => {
    const [rows] = await promisePool.query("SELECT MAX(user_id) AS max_id FROM users");
    const maxId = rows[0].max_id || 0; // Если таблица пуста, ставим 1

    await promisePool.query("ALTER TABLE users AUTO_INCREMENT = ?", [maxId + 1]);
};

const deleteUserById = async (id) => {
    
    try {
        const user = findUserById(id);
        if (user) {
            const delSql = `DELETE FROM users WHERE user_id = ?`;
            await promisePool.query(delSql, [id]);

            await resetAutoIncrement();

            console.log(`user with id ${id} deleted`);
            return {user_id: id, message: 'user deleted'};
        } else {
            return {user_id: id, message: 'not found'};
        }
    } catch (e) {
        console.error('error', e.message);
        return {error: e.message};
    }
};

/**
 * NON-SAFE login
 * @param {*} username
 * @param {*} password
 * @returns
 */
const selectUserByNameAndPassword = async (username, password) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT user_id, username, email, created_at, user_level FROM Users WHERE username=? AND password=?',
      [username, password],
    );
    console.log(rows);
    // return only first item of the result array
    return rows[0];
  } catch (error) {
    console.error(error);
    throw new Error('database error');
  }
};

const selectUserByUsername = async (username) => {
    try {
      const [rows] = await promisePool.query(
        'SELECT user_id, username, password, email, created_at, user_level FROM Users WHERE username=?',
        [username],
      );
      console.log(rows);
      // return only first item of the result array
      return rows[0];
    } catch (error) {
      console.error(error);
      throw new Error('database error');
    }
};

const editUser = async (id, username, pass, email) => {
    const sql = `UPDATE users
                SET password = '${pass}', username = '${username}', email = '${email}'
                WHERE user_id = ${id}`;
    try {
        const users = await promisePool.query(sql);
        console.log('users', users[0]);
        return {user_id: id, message: 'user data changed', new_data: [username, pass, email]};
    } catch (e) {
        console.error('error', e.message);
        return {error: e.message};
    }
}

export { 
    selectAllUsers as getAllUsers,
    findUserById,
    addUser,
    changePassByID,
    deleteUserById,
    selectUserByNameAndPassword,
    selectUserByUsername,
    editUser,
    changeUserById
};