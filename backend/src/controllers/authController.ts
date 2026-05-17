import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRole } from "../types/auth";

const generateToken = (id: string, role: UserRole) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET as string, { expiresIn: "1d" });

const buildAuthResponse = (
  user: {
    _id: string | { toString(): string };
    name: string;
    email: string;
    role: UserRole;
  },
  message: string
) => ({
  message,
  token: generateToken(user._id.toString(), user.role),
  user: {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  },
});

// Register
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body as {
      name?: string;
      email?: string;
      password?: string;
      role?: "admin" | "sales";
    };

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    if (password.trim().length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(409).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role,
    });

    res.status(201).json(buildAuthResponse(user, "User registered successfully."));
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

// Login
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };

    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password.trim(), user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    res.json(buildAuthResponse(user, "Login successful."));
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};
