// src/infrastructure/web/controllers/shipment.controller.ts

import { Request, Response } from "express";
import { AuthRequest } from "../../../interfaces/auth/IGetUser";
import { ShipmentService } from "../../../application/shipping/shipment.service";
import { container } from "../../../infrastructure/container";
import { ShipmentUpdateStatusRequest } from "../../../interfaces/order/shipment.interface";
import { ShipmentDTO } from "../../../application/dto/shipment.dto";

export class ShipmentController {
  private shipmentService: ShipmentService;

  constructor() {
    this.shipmentService = container.resolve("ShipmentService");
  }

  async createShipment(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = Number(req.user_id);

      if (!userId) {
        res.status(401).json({ message: "Usuario no autenticado" });
        return;
      }

      const shipmentData = {
        userId,
        packageInfo: req.body.packageInfo,
        destinationAddress: req.body.destinationAddress,
        exitAddress: req.body.exitAddress,
      };

      const result = await this.shipmentService.createShipment(shipmentData);

      if (result.isError) {
        res.status(result.statusCode || 400).json({
          message: result.message,
        });
        return;
      }

      res.status(201).json({
        message: "Orden de envío creada con éxito",
        shipment: result.data,
      });
    } catch (error) {
      console.error("Error en createShipment:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
  async getUserShipments(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = Number(req.user_id);
      if (!userId) {
        res.status(401).json({ message: "Usuario no autenticado" });
        return;
      }

      const parameters = req.query;

      const result = await this.shipmentService.getShipmentsByUserId(
        userId,
        parameters
      );

      if (result.isError) {
        res.status(result.statusCode || 400).json({
          message: result.message,
        });
        return;
      }

      res.status(200).json({
        message: "Envíos obtenidos con éxito",
        shipments: result.data,
      });
    } catch (error) {
      console.error("Error en getUserShipments:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  async findByTrackingNumber(
    req: Request,
    res: Response
  ): Promise<ShipmentDTO> {
    try {
      const trackingNumber = req.query.trackingNumber as string;
      if (!trackingNumber) {
        res.status(401).json({ message: "Usuario no autenticado" });
        return;
      }

      const result = await this.shipmentService.findByTrackingNumber(
        trackingNumber
      );

      if (result.isError) {
        res.status(result.statusCode || 400).json({
          message: result.message,
        });
        return;
      }

      res.status(200).json({
        message: "Envíos obtenidos con éxito",
        shipments: result.data,
      });
    } catch (error) {
      console.error("Error en getUserShipments:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  async updateStatus(req: Request, res: Response): Promise<boolean> {
    try {
      const { id, status }: ShipmentUpdateStatusRequest = req.body;
      const result = await this.shipmentService.updateStatus(id, status);
      if (result.isError) {
        res.status(result.statusCode || 400).json({
          message: result.message,
        });
        return;
      }

      res.status(200).json({
        message: "Estado del envio cambiado con éxito",
        shipments: result.data,
      });
    } catch (error) {
      console.error("Error en updateStatus:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  async assignRouteToShipment(req: Request, res: Response): Promise<void> {
    try {
      const { id, route_id, transporter_id } = req.body;
      
      const result = await this.shipmentService.assignRouteToShipment({
        id,
        routeId: route_id,
        transporterId: transporter_id,
      });

      if (result.isError) {
        res.status(result.statusCode || 400).json({
          message: result.message,
        });
        return;
      }

      res.status(200).json({
        message: "Ruta asignada con éxito",
        shipments: result.data,
      });
    } catch (error) {
      console.error("Error en assignRouteToShipment:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  async allRoutes(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = Number(req.user_id);
      if (!userId) {
        res.status(401).json({ message: "Usuario no autenticado" });
        return;
      }
      const result = await this.shipmentService.allRoutes();

      res.status(200).json({
        message: "Rutas disponibles éxito",
        routes: result,
      });
    } catch (error) {
      console.error("Error en getUserShipments:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  async allTransporters(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = Number(req.user_id);
      if (!userId) {
        res.status(401).json({ message: "Usuario no autenticado" });
        return;
      }

      const result = await this.shipmentService.allTransporters();

      res.status(200).json({
        message: "Transportes disponible disponibles éxito",
        transporters: result,
      });
    } catch (error) {
      console.error("Error en getUserShipments:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
}

// Exportar una instancia para ser utilizada en las rutas
export const shipmentController = new ShipmentController();
