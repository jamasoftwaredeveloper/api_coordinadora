import { Router } from "express";
import { validateBodyAuth } from "../middlewares/auth/registerValidation";
import { authController } from "../controllers/auth.controller";
const router = Router();

//routing
/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Endpoints para autenticación de usuarios
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       409:
 *         description: El email ya están en uso
 *       500:
 *         description: Error del servidor
 */
router.post("/api/auth/register", validateBodyAuth.register,  authController.createAccount.bind(authController)); // GET request

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Inicia sesión en la aplicación
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Autenticación exitosa
 *       401:
 *         description: Credenciales incorrectas
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.post("/api/auth/login", validateBodyAuth.login, authController.loginAccount.bind(authController)); // GET request

/**
 * @swagger
 * /api/auth/getUser:
 *   get:
 *     summary: Obtiene los datos del usuario autenticado
 *     security:
 *       - BearerAuth: []
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Información del usuario
 *       404:
 *         description: Usuario no encontrado
 *       409:
 *         description: El usuario no existe
 *       500:
 *         description: Error del servidor
 */
router.get("/api/auth/getUser", validateBodyAuth.authorization, authController.getUser.bind(authController)); // GET request

export default router;
