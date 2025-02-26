import bcrypt from 'bcryptjs';
import { changeUserById, getAllUsers, findUserById, addUser, changePassByID, deleteUserById, editUser } from "../models/user-model.js";
import { validationResult } from 'express-validator';


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
const getUserByID = async (req, res) => {
  console.log('getUserByID', req.params.id);
  
  const user = await findUserById(req.params.id)
  
  if (user) {
    res.json(user);
    console.log('user found:', user);
  } else {
    res.status(404).json({message: 'User not found, try another id'});
  }
};

//lisätä item
const newUser = async (req, res) => {
  const {username, password, email, user_level} = req.body;

  const errors = validationResult(req);
  //jos pyyntö sisältää name-ominaisuuden, lisätään uusi asia items-taulukkoon
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }
  if (username && (email && user_level) && password) {
    
    // generoidaan id-numero uudelle asialle (yhtä suurempi, kuin viimeisin)
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
      res.status(201);
      return res.json({message: 'User added. id: ' + result});
    } catch (error) {
      console.error(error.message);
      return res.status(400).json({message: 'DB error ' + error.message});
    }
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

const deleteUser = async (req, res) => {
  console.log('delete user by id', req.params.id);
  const id = req.params.id;

  let user = await findUserById(id);

  if (user) {
    const result = await deleteUserById(id);
    console.log(`user id ${id} deleted`, result);

    res.json({message: `user id ${id} deleted onnistui`});
    res.status(200);
  } else {
    res
    .status(400)
    .json({message: 'invalid id'});
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

const login = (req, res) => {
  const {username, password} = req.body;
  if (!username) {
    return res.status(401).json({message: 'username missing.'});
  }
  const user = users.find((user) => user.username === username);

  if (user && user.password === password) {
    res.json({message: 'login ok', user});
  } else {
    res.status(401).json({message: 'Bad username/password'});
  }
};

const editUserByID = async (req, res) => {
  const id = req.params.id;
  const userBody = req.body;
  console.log('change user by id', id);
  console.log('request body:', userBody);
  

  let user = await findUserById(id);
  let {username, password, email} = userBody;
  console.log(username, password, email);
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  if (userBody && user) {
    const result = await editUser(id, username, hashedPassword, email);
    console.log(`Users id ${id} data changed`, result);
    
    res.json({message: `data changed for user id ${id}`, new_data: userBody});
    res.status(200);
  } else {
    res
    .status(400)
    .json({message: "Invalid request: 'username', 'pass' and 'email' is required in the body or check the id"});
  }
};

const changeUserData = async (req, res) => {
  const userId = req.user.user_id;
  const { username, password, email } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  try {
    const result = await changeUserById(userId, { username, password: hashedPassword, email });
    console.log(`user id ${userId} data changed`, result);

    res.json({message: `user id ${userId} change onnistui`});
    res.status(200);
  } catch (e) {
    console.error('denied, check your data', e);
    res.status(500).json({ message: 'wrong data', error: e.message });
  }
};


export { changeUserData, getUsers, getUserByID, newUser, login, changePasswordByID, deleteUser, editUserByID};
