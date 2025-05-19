import { Request, Response } from "express";
import { AuthRequest } from "../../../interfaces/auth/IGetUser";
import { AuthService } from "../../../application/auth/auth.service";
import { container } from "../../container";

export class AuthController {
  private authService: AuthService;

  constructor() {
    // Podríamos usar un contenedor de DI como inversify o tsyringe aquí
    this.authService = container.resolve("AuthService");
  }

  async createAccount(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const result = await this.authService.register({
        email,
        password,
        ...req.body,
      });

      if (result.isError) {
        res.status(result.statusCode || 400).json({
          message: result.message,
        });
        return;
      }

      res.status(200).json({
        message: "Usuario creado con éxito",
        token: result.data.token,
      });
    } catch (error) {
      console.error("Error en createAccount:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  async loginAccount(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const result = await this.authService.login(email, password);

      if (result.isError) {
        res.status(result.statusCode || 400).json({
          message: result.message,
        });
        return;
      }

      res.status(200).json({
        message: "Autenticado",
        token: result.data.token,
      });
    } catch (error) {
      console.error("Error en loginAccount:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  async getUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = Number(req.user_id);

      const result = await this.authService.getUserById(userId);

      if (result.isError) {
        res.status(result.statusCode || 404).json({
          message: result.message,
        });
        return;
      }

      res.status(200).json({
        message: "Usuario autenticado",
        user: result.data.user,
      });
    } catch (error) {
      console.error("Error en getUser:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
}

// Exportar una instancia para ser utilizada en las rutas
export const authController = new AuthController();
