import mongoose from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({ ...req.body, password: hash });

    await newUser.save();
    res.status(200).send("User has been created!");
  } catch (err) {
    next(err);
    // next(createError(404, "not found sorry"));
  }
};

export const signin = async (req, res, next) => {
  
  try {
    const user = await User.findOne({ name: req.body.name });
    if (!user) return next(createError(404, "User not found!"));

    const isCorrect = await bcrypt.compare(req.body.password, user.password);

    if (!isCorrect) return next(createError(400, "Wrong Credentials!"));

    const token = jwt.sign({ id: user._id }, process.env.JWT, {
      expiresIn: "1h",
    });
    const { password, ...others } = user._doc;

    res.status(200).json({ ...others, token });
  } catch (err) {
    next(err);
  }
};

export const googleAuth = async (req, res, next) => {
  try {
   
    const { email, name, img } = req.body;
    let user = await User.findOne({ email: req.body.email });

    if (user) {
      // Generate a JWT token
      console.log('Received request body:', req.body);
      const token = jwt.sign({ id: user._id }, process.env.JWT, { expiresIn: '1h' });

      // Log the user data to verify
      console.log('Existing user:', user);
      console.log('Existing user img:', user.img);

      // Send user data along with the token
      res.status(200).json({
        user: user._doc,
        token
      });
    } else {
      const newUser = new User({
        name,
        email,
        img,
        fromGoogle: true,
      });
      const savedUser = await newUser.save();

      // Generate a JWT token
      const token = jwt.sign({ id: savedUser._id }, process.env.JWT, { expiresIn: '1h' });

      // Log the new user data to verify
      console.log('New user:', savedUser);

      // Send user data along with the token
      res.status(200).json(savedUser._doc);
    }
  } catch (err) {
    next(err);
  }
};
