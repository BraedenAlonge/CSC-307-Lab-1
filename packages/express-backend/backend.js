import express from "express";
import cors from "cors";
import users from "./user-services.js";

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

app.get("/users", async (req, res) => {
  const name = req.query.name;
  if (name != undefined) {
    users.findUserByName(name)
    .then((result) => {
      res.send({users_list: result});
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Internal server error (Usr-I).");
    });
  } else {
    users.getUsers()
    .then((result) => {
      res.send({users_list: result});
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Internal server error (Usr-II).");
    });
  }
});

app.get("/users/:id", async (req, res) => {
  const _id = req.params["id"]; //or req.params.id
  users.findUserById(_id)
  .then((result) => {
    if (!result) {
      res.status(404).send("Resource not found (UsrID).");
    } else {
      res.send(result);
    }
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send("Internal server error (UsrID).")
  });
});



//Search
app.get("/users/:name/:job", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  if (name === undefined || job === undefined) {
    res.status(400).send("Both name and job required.");
    return;
  }
    users.findUserByName(name)
    .then((result) => {
      const jobFilter = result.filter((user) => user.job === job);
      req.send({users_list: jobFilter });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Internal server error.");
    });
});



app.post("/users", (req, res) => {
  const userToAdd = req.body;
  
  users.addUser(userToAdd)
  .then((result) => {
    console.log(result);
    res.status(201).send(result);
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send("Internal server error (post).");
  });
});

app.delete("/users/:id", (req, res) => {
  console.log("Entering delete...");
  const _id = req.params["id"]; //or req.params.id
  console.log("ID: " + _id);
  users.deleteUser(_id)
  .then((result) => {
    console.log("Hello");
    console.log(result);
    if (result === undefined) {
      res.status(404).send("Bad Request.");
    } else {
      res.status(204).end();
    }
  })
 .catch((error) => {
  console.error(error);
  console.log("Catch delete...");
  res.status(500).send("Internal server error (delete).");
 })
});


