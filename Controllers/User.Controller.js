import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "../Models/User.Schema.js";
import Markdown from "../Models/MarkDown.Schema.js";
import jwt from "jsonwebtoken";
import { sendMail } from "../Services/SendMail.js";
dotenv.config();

export const RegisterUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password} = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const emailid = await User.findOne({ email });

    // if the user exists, return an error
    if (emailid) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      firstname,
      lastname,
      email,
      password: hashPassword,
    });
    await newUser.save();
    res.status(200).json({ message: "Register Successful", data: newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Register Failed" });
  }
};

export const Loginuser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "User not Found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid Password" });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    user.token = token;
    await user.save();
    res
      .status(200)
      .json({ message: "Login Successful", token: token, data: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Login Failed" });
  }
};

export const ListAllUsers = async (req, res) => {
  try {
    const allusers = await User.find();

    res.status(200).json({
      message: "All Users Fetched Successfully",
      data: allusers,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    let userExists = await User.findOne({ email: req.body.email });
    if (userExists && req.body.email !== "") {
      const tokenString = userExists.token;
      const mailId = req.body.email;

      const resetLink = `${process.env.Reset_Link}?token=${tokenString}&email=${mailId}`;
      const message = `
            <p>Hello ${userExists.lastname},</p>
            <p>You have requested to reset your password for URL Shortner. Click the button below to reset it:</p>
            <a href="${resetLink}">
              <button style="padding: 10px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">
                Reset Your Password
              </button>
            </a>
            `;
      sendMail(req.body.email, message);

      // update the DB with Token
      await User.updateOne({ email: req.body.email }, { token: tokenString });
      res.status(201).send({
        message: "Reset link sended to your mail-id",
      });
    } else {
      res.status(400).send({ message: `User does not exits` });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const ResetPassword = async (req, res) => {
  try {
    let user = await User.find({ email: req.body.email });

    if (user) {
      const password = req.body.password;
      const confirmPassword = req.body.confirmPassword;
      const equalPassword = password === confirmPassword;
      const hashedPassword = await bcrypt.hash(password, 10);

      if (equalPassword && password !== "" && confirmPassword !== "") {
        await User.updateOne(
          { email: req.body.email },
          { password: hashedPassword }
        );
        res.status(200).json({ message: "Updated Successfully" });
      } else {
        res
          .status(400)
          .json({ message: "Password and confirm password doesn't match" });
      }
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Create a new markdown document
export const CreateMarkDown = async (req, res) => {
  try {
    const { content } = req.body;
    const newMarkdown = new Markdown({ content });
    await newMarkdown.save();
    res.status(201).send(newMarkdown);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Server error' });
  }
};

// // Get all markdown documents
// export const MarkDownList = async (req, res) => {
//   try {
//     const markdownList = await Markdown.find();
//     res.send(markdownList);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ message: 'Server error' });
//   }
// };

// Get a single markdown document by ID
export const MarkDownListById = async (req, res) => {
  try {
    const markdown = await Markdown.findById(req.params.id);
    if (!markdown) {
      return res.status(404).send({ message: 'Markdown document not found' });
    }
    res.send(markdown);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Server error' });
  }
};

// Update a markdown document
export const MarkDownListUpdate = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).send({ message: 'Content is required' });
    }

    const updatedMarkdown = await Markdown.findByIdAndUpdate(
      req.params.id,
      { content },
      { new: true }
    );

    if (!updatedMarkdown) {
      return res.status(404).send({ message: 'Markdown document not found' });
    }

    res.send(updatedMarkdown);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Server error' });
  }
};


// Delete a markdown document
export const MarkDownListDelete = async (req, res) => {
  try {
    const deletedMarkdown = await Markdown.findByIdAndRemove(req.params.id);
    if (!deletedMarkdown) {
      return res.status(404).send({ message: 'Markdown document not found' });
    }
    res.send({ message: 'Markdown document deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Server error' });
  }
};

// // Fetch data for chart
// router.get('/fetch-data', async (req, res) => {
//   try {
//     const totalMarkdowns = await Markdown.countDocuments();
//     const totalUsers = await User.countDocuments();
//     res.json({ totalMarkdowns, totalUsers });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

