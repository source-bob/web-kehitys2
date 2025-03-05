import bcrypt from 'bcryptjs';
import { changeUserById, getAllUsers, findUserById, addUser, changePassByID, deleteUserById, editUser } from "../models/user-model.js";

import { customError } from '../middlewares/error-handler.js';

const checkLevel = async (user) => {
  if (user === 'regular') {
    return false;
  } else if (user === 'admin') {
    return true;
  }
};

const users = getAllUsers();
//kaikkien items hakua
const getUsers = async (req, res) => {
  const users = await getAllUsers();

  if (!users.error) {
    res.json(users);
  } else {
    res.status(500);
    res.json(users);
  }
};

//TODO getUserById, käyttäjän lisäys

//itemin haku id:n perusteella


//lisätä item
/*const newUser = async (req, res) => {
  

  const errors = validationResult(req);
  //jos pyyntö sisältää name-ominaisuuden, lisätään uusi asia items-taulukkoon
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  } else {
    const {username, password, email, user_level} = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      username: username,
      password: hashedPassword,
      email: email,
      user_level: user_level
    };

    console.log('Add user request body', newUser);
    
    try {
      const result = await addUser(newUser);
      return res.status(201).json({message: 'User added. id: ' + result});
    } catch (error) {
      console.error(error.message);
      return res.status(400).json({message: 'DB error ' + error.message});
    }
  }
};*/


const newUser = async (req, res, next) => {
  const check = await checkLevel(req.user.user_level);

  if (check === false) {
    return next(customError('Forbidden'));
  }
  const { username, password, email, user_level } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = { username, password: hashedPassword, email, user_level };

    const result = await addUser(newUser);

    res.status(201).json({ message: `User added. ID: ${result}` });

  } catch (error) {
    next(customError(error.message, 400));
  }

  
  
  
};

const editUserByID = async (req, res, next) => {
  const id = req.params.id;
  const { username, password, email } = req.body;
  const check = await checkLevel(req.user.user_level);
  
  if (check === false) {
    return next(customError('access denied'));
  }
  console.log('Change user by ID:', id);
  console.log('Request body:', req.body);

  try {
    let user = await findUserById(id);
    if (!user) {
      return next(customError(`User with ID ${id} not found`, 404));
    }

    // Хеширование пароля
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await editUser(id, username, hashedPassword, email);
    console.log(`User ID ${id} data changed`, result);

    res.status(200).json({
      message: `Data changed for user ID ${id}`,
      new_data: { username, email },
    });
  } catch (e) {
    next(customError(e.message, 400));
  }
};

//TODO: getById, post, put and delete /done


const changePasswordByID = async (req, res) => {
  console.log('change password by id', req.params.id);
  const id = req.params.id;

  let user = await findUserById(id);
  let pass = req.body.password;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(pass, salt);
  if (pass && user) {
    const result = await changePassByID(id, hashedPassword);
    console.log(`Users id ${id} password changed`, result);
    
    res.json({message: `password changed for user id ${id}`, new_password: pass});
    res.status(200);
  } else {
    res
    .status(400)
    .json({message: "Invalid request: 'password' is required in the body or check the id"});
  }
};

const getUserByID = async (req, res, next) => {
  console.log('getUserByID', req.params.id);
  
  try {
    const user = await findUserById(req.params.id)
    if (user) {
      res.json(user);
      console.log('user found:', user);
    } else {
      res.status(404).json({message: 'User not found, try another id'});
    }
  } catch (e) {
    next(customError(e.message, 400));
  }
};



/*const delUserByID = (req, res) => {
  console.log('delete user by id', req.params.id);

  const userIndex = users.findIndex((user) => user.id == req.params.id);

  if (userIndex !== -1) {
    const deletedUser = users[userIndex];
    users.splice(userIndex, 1);
    console.log('Deleted user:', deletedUser);
    res.json({message: 'User deleted successfully', deletedUser});
  } else {
    res.status(404).json({message: 'Item not found'});
  }
};*/

const login = (req, res, next) => {
  const {username, password} = req.body;
  if (!username) {
    return next(customError('wrong params', 400));
  }
  const user = users.find((user) => user.username === username);

  if (user && user.password === password) {
    res.json({message: 'login ok', user});
  } else {
    res.status(401).json({message: 'Bad username/password'});
  }
};

// for admin


const deleteUser = async (req, res, next) => {
  console.log('delete user by id', req.params.id);
  const id = req.params.id;
  const check = await checkLevel(req.user.user_level);
  
  if (check === false) {
    return next(customError('access denied'));
  }
  let user = await findUserById(id);

  try {
    if (user !== undefined) {
      const result = await deleteUserById(id);
      console.log(`user id ${id} deleted`, result);
  
      res.json({message: `user id ${id} deleted onnistui`});
      res.status(200);
    } else {
      return next(customError('user not found', 404));
    }
  } catch (e) {
    next(customError(e.message, 404));
  }
};


const changeUserData = async (req, res, next) => {
  const userId = req.user.user_id;
  const { username, password, email } = req.body;
  
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const result = await changeUserById(userId, { username, password: hashedPassword, email });
    console.log(`user id ${userId} data changed`, result);

    res.json({message: `user id ${userId} change onnistui`});
    res.status(200);
  } catch (e) {
    next(e);
  }
};


export { changeUserData, getUsers, getUserByID, newUser, login, changePasswordByID, deleteUser, editUserByID};
