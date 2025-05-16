// src/infrastructure/web/middlewares/validate-shipment.middleware.ts

import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../../../../interfaces/auth/IGetUser";

export const validateShipmentMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const { packageInfo, destinationAddress } = req.body;

  // Validar la información del paquete
  if (!packageInfo) {
    res
      .status(400)
      .json({ message: "La información del paquete es requerida" });
    return;
  }

  // Validar peso y dimensiones
  const { weight, height, width, length, productType } = packageInfo;
  if (!weight || !height || !width || !length || !productType) {
    res.status(400).json({
      message: "Peso, dimensiones y tipo de producto son requeridos",
    });
    return;
  }

  // Validar que los valores sean números positivos
  if (weight <= 0 || height <= 0 || width <= 0 || length <= 0) {
    res.status(400).json({
      message: "Peso y dimensiones deben ser valores positivos",
    });
    return;
  }

  // Validar dirección de destino
  if (!destinationAddress) {
    res.status(400).json({ message: "La dirección de destino es requerida" });
    return;
  }

  // Validar campos requeridos de la dirección
  const {
    street,
    city,
    state,
    postalCode,
    country,
    recipientName,
    recipientPhone,
  } = destinationAddress;
  if (
    !street ||
    !city ||
    !state ||
    !postalCode ||
    !country ||
    !recipientName ||
    !recipientPhone
  ) {
    res.status(400).json({
      message: "Todos los campos de la dirección de destino son requeridos",
    });
    return;
  }

  // Si todo está correcto, continuar
  next();
};
