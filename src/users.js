const users = [
  {
    id: 1,
    username: 'johndoe',
    password: 'password1',
    email: 'johndoe@example.com',
  },
  {
    id: 2,
    username: 'janedoe',
    password: 'password2',
    email: 'janedoe@example.com',
  },
  {
    id: 3,
    username: 'bobsmith',
    password: 'password3',
    email: 'bobsmith@example.com',
  },
];

//kaikkien items hakua
const getUsers = (req, res) => {
  res.json(users);
};

//TODO getUserById, käyttäjän lisäys

//itemin haku id:n perusteella
const getUserByID = (req, res) => {
  console.log('getUserByID', req.params.id);
  const user = users.find((user) => {
    return user.id == req.params.id;
  });
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({message: 'User not found'});
  }
  console.log('user found:', user);
  res.json(user);
};

//lisätä item
const addUser = (req, res) => {
  console.log('Add user request body', req.body);
  const {username, password, email} = req.body;
  //jos pyyntö sisältää name-ominaisuuden, lisätään uusi asia items-taulukkoon
  if (username && password && email) {
    // generoidaan id-numero uudelle asialle (yhtä suurempi, kuin viimeisin)
    const latestID = users[users.length - 1].id;
    const newUser = {
      id: latestID + 1,
      username: username,
      password: password,
      email: email,
    };
    users.push(newUser);
    res.status(201);
    return res.json({message: 'User added'});
  }
  res.status(400);
  return res.json({message: 'Request missing properties.'});
};

//TODO: getById, post, put and delete /done

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

const changePassByID = (req, res) => {
  console.log('change item by id', req.params.id);

  let oldUser;
  const user = users.find((user) => {
    if (user.id == req.params.id) {
      oldUser = {...user};
      return true;
    }
    return false;
  });

  if (user) {
    const {password} = req.body;
    if (password) {
      user.password = password;
      console.log('Item changed. Old:', oldUser, 'New:', user);
      res.json({message: 'Password changed!', user});
      res.status(200);
    } else {
      res
        .status(400)
        .json({message: "Invalid request: 'password' is required in the body"});
    }
  } else {
    res.status(404).json({message: 'User not found'});
  }
};

const delUserByID = (req, res) => {
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
};

export {getUsers, getUserByID, addUser, login, changePassByID, delUserByID};
