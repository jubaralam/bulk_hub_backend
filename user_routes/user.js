const express = require("express");
const userRouter = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserModel = require("../user.model/user.model");
userRouter.get("/", (req, res) => {});


// registration route
userRouter.post("/register", async (req, res) => {
  const { name, role, email, password } = req.body;

  // Validate request body
  if (!name || !role || !email || !password) {
    return res.status(400).send({ message: "All fields are required" });
  }

  try {
    // Checking if user already exists or not
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .send({ message: "You are already registered, please log in" });
    }

    // Hash password and save user
    const hashedPassword = await bcrypt.hash(password, 5);
    const newUser = new UserModel({ name, email, role, password: hashedPassword });
    await newUser.save();

    res.status(201).send({ message: "You have been registered successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error: error.message });
  }
});



//login route
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Validate request body
  if (!email || !password) {
    return res.status(400).send({ message: "Email and password are required" });
  }

  try {
    // Check if user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).send({ message: "Invalid credentials" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.secreteKey, {
      expiresIn: "1h",
    });

    res.status(200).send({
      message: "You have logged in successfully",
      token,
    });
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error: error.message });
  }
});

//updating user date
userRouter.put("/update/:id", async (req, res) => {
  const { id } = req.params; 
  const { name, role, email, password } = req.body; 

  // Validate request body
  if (!name && !role && !email && !password) {
    return res.status(400).send({ message: "No fields to update provided" });
  }

  try {
    // Find the user by ID
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Prepare updated fields
    const updates = {};
    if (name) updates.name = name;
    if (role) updates.role = role;
    if (email) updates.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 5);
      updates.password = hashedPassword;
    }

    // Update the user data
    await UserModel.findByIdAndUpdate(id, updates, { new: true });

    res.status(200).send({ message: "User data updated successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error: error.message });
  }
});

//deleting user 
userRouter.delete("/delete/:id", async (req, res) => {
  const { id } = req.params; 

  try {
    // Find and delete the user by ID
    const user = await UserModel.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error: error.message });
  }
});



module.exports = userRouter;
