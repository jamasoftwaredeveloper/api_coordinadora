import { Request, Response } from "express";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import { generateJWT } from "../utils/jwt";
import { AuthRequest, ProfileRequest } from "../interfaces/auth/IGetUser";

export const createAccount = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const userExists = await User.findByEmail(email);

    if (userExists) {
      const error = new Error("El email, ya no están disponible.");
      res.status(409).json({ message: error.message, status: 409 });
      return;
    }

    // Opción 1
    const user = req.body;
    user.password = await hashPassword(password);

    const userNew = await User.create(user);
    const token = generateJWT({ id: userNew.id, email: userNew.email });

    res.status(200).json({ message: "Usuario creado con exito..", token });
  } catch (err) {
    res.status(500).json({ message: err.message });
    return;
  }
};

export const loginAccount = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);

    if (!user) {
      const error = new Error("El email no concide con ningún usuario.");
      res.status(404).json({ message: error.message });
      return;
    }
    const resultCheckPassword = await checkPassword(password, user.password);

    if (!resultCheckPassword) {
      const error = new Error("Revisar el correo o la contraseña, no validas");
      res.status(401).json({ message: error.message });
      return;
    }
    const token = generateJWT({ id: user.id, email: user.email });

    res.status(200).json({ message: "Autenticado..", token });
  } catch (err) {
    res.status(500).json({ message: err.message });
    return;
  }
};

export const getUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  var user = await User.findById(Number(req.user_id));
  if (!user) {
    const error = new Error("El usuario no exito");
    res.status(409).json({ message: error.message, status: 404 });
    return;
  }
  res.status(200).json({ message: "Usuario autenticaod", user });
};
