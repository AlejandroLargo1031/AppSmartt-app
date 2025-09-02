import { Request, Response } from "express";
import { AuthService } from "./auth.service";

export const registerController = async (req: Request, res: Response) => {
  try {
    console.log('Register request body:', req.body);
    
    if (!req.body) {
      return res.status(400).json({ message: "Request body is missing" });
    }

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email y password son requeridos" });
    }

    const user = await AuthService.register(email, password);
    res.status(201).json(user);
  } catch (error: any) {
    console.error('Register error:', error);
    res.status(400).json({ message: error.message });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    console.log('Login request body:', req.body);
    
    if (!req.body) {
      return res.status(400).json({ message: "Request body is missing" });
    }

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email y password son requeridos" });
    }

    const data = await AuthService.login(email, password);
    res.status(200).json(data);
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(401).json({ message: error.message });
  }
};
