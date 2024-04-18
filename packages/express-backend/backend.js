import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});
const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor"
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer"
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor"
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress"
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender"
    },
 
  ]
};


app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});
app.get("/users", (req, res) => {
  const name = req.query.name;
  if (name != undefined) {
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result);
  } else {
    res.send(users);
  }
});

//Search
app.get("/users/:name/:job", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  if (name === undefined || job === undefined) {
    res.status(400).send("Both name and job required.");
    return;
  }
    let result = findUserByNameAndJob(name, job);
    result = { users_list: result };
    res.send(result);
});



app.post("/users", (req, res) => {
  const userToAdd = req.body;
  generateID(userToAdd);
  addUser(userToAdd);
  console.log(userToAdd);
  res.status(201).send(userToAdd);
});

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(400).send("Bad Request.");
  } else {
    res.status(deleteUser(id)).end();
  }
});

//Helper functions

//Name
const findUserByName = (name) => {
  return users["users_list"].filter(
    (user) => user["name"] === name
  );
};

//Name and Job
const findUserByNameAndJob = (name, job) => {
  return users["users_list"].filter(
    (user) => user["name"] === name && user["job"] === job
  );
};

//Id
const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);


//Add user
const addUser = (user) => {
 users["users_list"].push(user);
  return user;
};

//Delete user
const deleteUser = (id) => {
  users["users_list"] = users["users_list"].filter((users) => (id != users.id));
   return 204;
 };

 //Generate Random ID

 const generateID = (userToAdd) => {
  var letID1 = Math.trunc(Math.random() *26);
  var letID2 = Math.trunc(Math.random() *26);
  var letID3 = Math.trunc(Math.random() *26);
  letID1 = String.fromCharCode(letID1 + 65);
  letID2 = String.fromCharCode(letID2 + 65);
  letID3 = String.fromCharCode(letID3 + 65);

  var digID = Math.trunc(Math.random() * 1000);
  var ident = letID1 + letID2 + letID3 + digID;
   userToAdd.id = ident.toLowerCase();
 }