var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import { Router } from "express";
import jwt from "jsonwebtoken";
const secertkey = "hgfsdartwfssggbdhdbhsbdjsbssjnsb";
const app = express();
const PORT = 5001;
mongoose.connect("mongodb://127.0.0.1:27017/typescripts")
    .then(() => {
    console.log("MONGODB CONNECTED");
});
app.use(express.json());
const userSchema = new Schema({
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
const User = model("User", userSchema);
// Routes
const router = Router();
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = yield bcrypt.hash(password, 10);
        const createUser = yield User.create({
            username,
            email,
            password: hashedPassword
        });
        const token = jwt.sign({ createUser: createUser._id }, secertkey, { expiresIn: "5d" });
        return res.status(201).json({ token, createUser, message: "Signup Successful" });
    }
    catch (error) {
        return res.status(500).json({ message: "Error in Signup", error });
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const isMatch = yield bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const token = jwt.sign({ user: user._id }, secertkey, { expiresIn: "5d" });
        return res.status(200).json({ token, user, message: "Login Successful" });
    }
    catch (error) {
        return res.status(500).json({ message: "Error in Login", error });
    }
}));
// Use the routes
app.use("/user", router);
app.get("/", (req, res) => {
    return res.send("Harash");
});
app.listen(PORT, () => console.log(`Server Started At PORT: ${PORT}`));
//# sourceMappingURL=index.js.map