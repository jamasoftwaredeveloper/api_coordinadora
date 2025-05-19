import { body, validationResult } from "express-validator";
import { verifyToken } from "../../../../utils/jwt";
import { ShipmentStatus } from "../../../../interfaces/order/shipment.interface";

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
  validateShipment: [
    // Validación del ID de usuario
    body("userId")
      .isInt({ gt: 0 })
      .withMessage("El ID de usuario debe ser un número entero positivo")
      .notEmpty()
      .withMessage("El ID de usuario no debe estar vacío"),

    // Validación de la información del paquete
    body("packageInfo.weight")
      .isFloat({ gt: 0 })
      .withMessage("El peso debe ser un número mayor a 0")
      .notEmpty()
      .withMessage("El peso no debe estar vacío"),

    body("packageInfo.dimensions")
      .isString()
      .withMessage("Las dimensiones deben ser una cadena de texto")
      .notEmpty()
      .withMessage("Las dimensiones no deben estar vacías"),

    body("packageInfo.height")
      .isFloat({ gt: 0 })
      .withMessage("La altura debe ser un número mayor a 0"),

    body("packageInfo.width")
      .isFloat({ gt: 0 })
      .withMessage("El ancho debe ser un número mayor a 0"),

    body("packageInfo.length")
      .isFloat({ gt: 0 })
      .withMessage("La longitud debe ser un número mayor a 0"),

    body("packageInfo.productType")
      .isString()
      .withMessage("El tipo de producto debe ser una cadena de texto")
      .notEmpty()
      .withMessage("El tipo de producto no debe estar vacío"),

    // Validación de la dirección de salida
    body("exitAddress.street")
      .isString()
      .withMessage("La calle debe ser una cadena de texto")
      .notEmpty()
      .withMessage("La calle no debe estar vacía"),

    body("exitAddress.city")
      .isString()
      .withMessage("La ciudad debe ser una cadena de texto")
      .notEmpty()
      .withMessage("La ciudad no debe estar vacía"),

    body("exitAddress.state")
      .isString()
      .withMessage("El estado debe ser una cadena de texto")
      .notEmpty()
      .withMessage("El estado no debe estar vacío"),

    body("exitAddress.postalCode")
      .isString()
      .withMessage("El código postal debe ser una cadena de texto")
      .notEmpty()
      .withMessage("El código postal no debe estar vacío"),

    body("exitAddress.country")
      .isString()
      .withMessage("El país debe ser una cadena de texto")
      .notEmpty()
      .withMessage("El país no debe estar vacío"),

    body("exitAddress.recipientName")
      .isString()
      .withMessage("El nombre del destinatario debe ser una cadena de texto")
      .notEmpty()
      .withMessage("El nombre del destinatario no debe estar vacío"),

    body("exitAddress.recipientPhone")
      .isString()
      .withMessage("El teléfono del destinatario debe ser una cadena de texto")
      .notEmpty()
      .withMessage("El teléfono del destinatario no debe estar vacío"),

    // Validación del estado
    body("status")
      .isIn([
        ShipmentStatus.CANCELLED,
        ShipmentStatus.DELIVERED,
        ShipmentStatus.PENDING,
        ShipmentStatus.PROCESSING,
        ShipmentStatus.SHIPPING,
      ])
      .withMessage(
        "El estado debe ser uno de: Pending, In Transit, Delivered, Cancelled"
      ),

    // Manejo de errores
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ],
  validateTransporter: [
    // Validación del ID de usuario
    body("name")
      .isString()
      .withMessage("El nombre debe ser una cadena de testo")
      .notEmpty()
      .withMessage("El nombre no debe estar vacío"),
    // Validación de la información del paquete
    body("vehicle_capacity")
      .isInt({ gt: 0 })
      .withMessage("El capacidad del vehiculo debe ser un número mayor a 0")
      .notEmpty()
      .withMessage("La capacidad del vehiculo  no debe estar vacío"),
    // Manejo de errores
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ],
  updateShipmentStatus: [
    body("id")
      .isInt({ gt: 0 })
      .withMessage("El ID del envío debe ser un número entero positivo")
      .notEmpty()
      .withMessage("El ID del envío no debe estar vacío"),
    body("status")
      .isIn([
        ShipmentStatus.CANCELLED,
        ShipmentStatus.DELIVERED,
        ShipmentStatus.PENDING,
        ShipmentStatus.PROCESSING,
        ShipmentStatus.SHIPPING,
      ])
      .withMessage(
        "El estado debe ser uno de: Pending, Processing, Shipping, Delivered, Cancelled"
      ),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ],
  
};
