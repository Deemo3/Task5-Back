const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());
mongoose.connect("mongodb://127.0.0.1:27017/crudUsers").then(() => console.log("MongoDB Connected")).catch((err) => console.log(err));

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  city: String,
});

const User = mongoose.model("User", userSchema);

// 1. POST - Add 5 users
app.post("/users", async (req, res) => {
  try {
    const users = await User.insertMany([
      { name: "Deema", age: 23, city: "Riyadh" },
      { name: "Dana", age: 22, city: "Cairo" },
      { name: "Omar", age: 10, city: "Dammam" },
      { name: "Tareq", age: 18, city: "Makkah" },
      { name: "Mohammed", age: 20, city: "Cairo" },
    ]);

    res.status(201).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. GET - Retrieve all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. GET by ID - Retrieve a specific user using _id 
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user){
      return res.status(404).json({ message: "User Not Found" });
    }

    res.json(user);
  } catch (err){
    res.status(400).json({ message: "Invalid User ID" });
  }
});

// 4. PATCH - Update a user using _id
app.patch("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!user){
      return res.status(404).json({ message: "User Not Found" });
    }

    res.json(user);
  } catch (err){
    res.status(400).json({ message: err.message });
  }
});

// 5. DELETE - Delete a user using _id
app.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user){
      return res.status(404).json({ message: "User Not Found" });
    }

    res.json({ message: "User Deleted Successfully", user });
  } catch (err){
    res.status(400).json({ message: "Invalid User ID" });
  }
});

// Start server
app.listen(3000, () => {
  console.log("Server Running On Port 3000");
});