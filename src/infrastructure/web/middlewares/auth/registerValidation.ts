import { body, validationResult } from "express-validator";
import { verifyToken } from "../../../../utils/jwt";

// Middleware de validación para las operaciones de SpecialPrice
export const validateBodyAuth = {
  // Validación para crear y actualizar SpecialPrice
  register: [
    body("name")
      .isLength({ min: 3 })
      .withMessage("El nombre, debe tener minimo 3 caracteres")
      .notEmpty()
      .withMessage("El nombre, no debe estar vacio."),
    body("email")
      .notEmpty()
      .withMessage("El email, no debe estar vacio.")
      .isEmail()
      .withMessage("El email, debe ser tipo email."),
    body("password")
      .notEmpty()
      .withMessage("La contraseña, no debe estar vacia.")
      .isLength({ min: 8 })
      .withMessage("La contraseña, debe tener minimo 8 caracteres."),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ],
  login: [
    body("email").notEmpty().withMessage("El email, no debe estar vacio."),
    body("password")
      .notEmpty()
      .withMessage("La contraseña, no debe estar vacia."),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ],
  authorization: [
    (req, res, next) => {
      // Verificar si el token está presente en los headers
      const bearer = req.headers.authorization;
      if (!bearer) {
        return res
          .status(401)
          .json({ message: "Token requerido en la cabecera Authorization." });
      }

      const [, token] = bearer.split(" ");

      if (!token) {
        return res
          .status(401)
          .json({ message: "Token requerido en la cabecera Authorization." });
      }

      try {
        const decoded = verifyToken(token); // Asegurar que es un objeto
        if (!decoded || typeof decoded === "string") {
          throw new Error("Token inválido");
        }
        req.user_id = decoded.payload.id;      
        next();
      } catch (error) {
        return res.status(401).json({ error: "Token invalido." });
      }
    },
  ],
};
