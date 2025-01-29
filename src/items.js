const items = [
  {id: 1, name: 'Bob'},
  {id: 2, name: 'Jack'},
  {id: 3, name: 'Mindy'},
  {id: 4, name: 'Alice'},
];

//kaikkien items hakua
const getItems = (req, res) => {
  res.json(items);
};

//itemin haku id:n perusteella
const getItemByID = (req, res) => {
  console.log('getItemByID', req.params.id);
  const item = items.find((item) => {
    return item.id == req.params.id;
  });
  if (item) {
    res.json(item);
  } else {
    res.status(404).json({message: 'Item not found'});
  }
  console.log('items found:', item);
  res.json(item);
};

//lisätä item
const addItems = (req, res) => {
  console.log('Add item request body', req.body);
  //jos pyyntö sisältää name-ominaisuuden, lisätään uusi asia items-taulukkoon
  if (req.body.name) {
    // generoidaan id-numero uudelle asialle (yhtä suurempi, kuin viimeisin)
    const latestID = items[items.length - 1].id;
    const newItem = {id: latestID + 1, name: req.body.name};
    items.push(newItem);
    res.status(201);
    return res.json({message: 'Item added'});
  }
  res.status(400);
  return res.json({message: 'Request missing name property.'});
};

//TODO: getById, post, put and delete /done

//TODO: put and delete endpoints
//TODO lisää users.js, ks. materiaali week2

const putItemByID = (req, res) => {
  console.log('change item by id', req.params.id);

  let oldItem;
  const item = items.find((item) => {
    if (item.id == req.params.id) {
      oldItem = {...item};
      return true;
    }
    return false;
  });

  if (item) {
    const {name} = req.body;
    if (name) {
      item.name = name;
      console.log('Item changed. Old:', oldItem, 'New:', item);
      res.json(item);
    } else {
      res
        .status(400)
        .json({message: "Invalid request: 'name' is required in the body"});
    }
  } else {
    res.status(404).json({message: 'Item not found'});
  }
};

const delItemByID = (req, res) => {
  console.log('delete item by id', req.params.id);

  const itemIndex = items.findIndex((item) => item.id == req.params.id);

  if (itemIndex !== -1) {
    const deletedItem = items[itemIndex];
    items.splice(itemIndex, 1);
    console.log('Deleted item:', deletedItem);
    res.json({message: 'Item deleted successfully', deletedItem});
  } else {
    res.status(404).json({message: 'Item not found'});
  }
};

export {getItems, addItems, getItemByID, putItemByID, delItemByID};
