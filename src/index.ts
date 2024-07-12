import express, { Request, Response } from "express";
import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import { Router } from "express";

const app = express();
const PORT = 5001;

mongoose.connect("mongodb://127.0.0.1:27017/typescripts")
  .then(() => {
    console.log("MONGODB CONNECTED");
  })


app.use(express.json());

// User Schema and Model
interface IUser {
  username: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  }
});

const User = model<IUser>("User", userSchema);

// Routes
const router = Router();

router.post("/signup", async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const createUser = await User.create({
      username,
      email,
      password: hashedPassword
    });
    return res.status(201).json({ createUser, message: "Signup Successful" });
  } catch (error) {
    return res.status(500).json({ message: "Error in Signup", error });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.status(200).json({ user, message: "Login Successful" });
  } catch (error) {
    return res.status(500).json({ message: "Error in Login", error });
  }
});

// Use the routes
app.use("/user", router);


app.get("/", (req: Request, res: Response) => {
  return res.send("Harash");
});


app.listen(PORT, () => console.log(`Server Started At PORT: ${PORT}`));
