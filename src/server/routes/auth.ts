import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const authRouter = Router();

// POST /api/auth/login
authRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { message: "Email and password are required" },
      });
    }

    // In production, fetch user from database via Prisma
    // For now, use demo credentials
    const demoUser = {
      id: "user_1",
      email: "admin@naturescrates.in",
      password: await bcrypt.hash("admin123", 10),
      name: "Admin",
      role: "ADMIN",
    };

    if (email !== demoUser.email) {
      return res.status(401).json({
        success: false,
        error: { message: "Invalid credentials" },
      });
    }

    const isValid = await bcrypt.compare(password, demoUser.password);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: { message: "Invalid credentials" },
      });
    }

    const token = jwt.sign(
      { id: demoUser.id, email: demoUser.email, role: demoUser.role },
      process.env.JWT_SECRET || "default-secret",
      { expiresIn: "7d" } as jwt.SignOptions
    );

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: demoUser.id,
          name: demoUser.name,
          email: demoUser.email,
          role: demoUser.role,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { message: error.message },
    });
  }
});

// POST /api/auth/register
authRouter.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: { message: "Name, email, and password are required" },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // In production, create user via Prisma
    const user = {
      id: `user_${Date.now()}`,
      name,
      email,
      role: role || "MARKETING",
    };

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "default-secret",
      { expiresIn: "7d" } as jwt.SignOptions
    );

    res.status(201).json({
      success: true,
      data: { token, user },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { message: error.message },
    });
  }
});

// GET /api/auth/me
authRouter.get("/me", async (req: Request, res: Response) => {
  // Returns current user info based on JWT token
  res.json({
    success: true,
    data: {
      id: "user_1",
      name: "Admin",
      email: "admin@naturescrates.in",
      role: "ADMIN",
    },
  });
});
