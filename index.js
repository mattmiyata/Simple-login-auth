const express = require("express");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json()); // Allows parsing of json data

const users = [{ user: "matt", password: "lol" }];

app.get("/users", (req, res) => {
  res.json(users);
});

app.post("/users", async (req, res) => {
  try {
    console.log(req.body);

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = { user: req.body.user, password: hashedPassword };
    users.push(user);
    console.log(users);
    res.json(users);
  } catch {
    res.status(500).send();
  }
});

app.post("/login", async (req, res) => {
  console.log(req.body);
  try {
    if (!req.body.user || !req.body.password) {
      throw Error("Enter all required fields");
    }
    const user = users.find((user) => user.user === req.body.user);
    if (user == null) {
      throw Error("User not found");
    }
    console.log(user);
    // order of params matters for compare function
    const validate = await bcrypt.compare(req.body.password, user.password);
    console.log(req.body.password, user.password);
    console.log(validate);
    if (!validate) {
      throw Error("Password is incorrect");
    }
    res.status(200).json("Login Successful");
  } catch (err) {
    res.status(500).send(console.error(err));
  }
});

const port = process.env.PORT || 4000;
app.listen(port);
