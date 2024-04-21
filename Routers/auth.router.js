const express = require("express");
const { User } = require("../Models/user.model");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// login Endpoint
authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, "arba", { expiresIn: "1h" });

    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Register endpoint
authRouter.post("/register", async (req, res) => {
  const { fullName, userName, email, password } = req.body;
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      fullName,
      userName,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Forgot password endpoint

authRouter.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate password reset token (for simplicity, just using a random string)
    const resetToken = Math.random().toString(36).substring(7);

    // Update user with reset token (you may need to save it in database)
    user.resetToken = resetToken;
    await user.save();

    // Send password reset link via email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "adilrza9354@gmail.com",
        pass: "kgei psfz jjmd ssih",
      },
    });
    const mailOptions = {
      from: "adilrza9354@gmail.com",
      to: email,
      subject: "Password Reset",
      text: `Your password reset token is: ${resetToken}`,
    };
    await transporter.sendMail(mailOptions);

    res.json({ message: "Password reset token sent to your email" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = {
  authRouter,
};
