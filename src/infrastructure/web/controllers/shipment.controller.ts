// src/infrastructure/web/controllers/shipment.controller.ts

import { Request, Response } from "express";
import { AuthRequest } from "../../../interfaces/auth/IGetUser";
import { ShipmentService } from "../../../application/shipping/shipment.service";
import { container } from "../../../infrastructure/container";
import { Filter, ShipmentUpdateStatusRequest } from "../../../interfaces/order/shipment.interface";
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
        message: "Envío registrado correctamente",
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

      const parameters: Filter = {
        page: req.query.page ? Number(req.query.page) : undefined,
        pageSize: req.query.pageSize ? Number(req.query.pageSize) : undefined,
        search: req.query.search as string,
        route_id: req.query.route_id ? Number(req.query.route_id) : undefined,
        transporter_id: req.query.transporter_id ? Number(req.query.transporter_id) : undefined,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        status: req.query.status as string,
      };

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

  async getTransporterPerformanceMetrics(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = Number(req.user_id);
      if (!userId) {
        res.status(401).json({ message: "Usuario no autenticado" });
        return;
      }

      const parameters = req.query;
      const result =
        await this.shipmentService.getTransporterPerformanceMetrics(parameters);

      res.status(200).json({
        message: "Transportes disponibles, éxito",
        transporters: result,
      });
    } catch (error) {
      console.error("Error en getUserShipments:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  async getRoutePerformanceMetrics(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = Number(req.user_id);
      if (!userId) {
        res.status(401).json({ message: "Usuario no autenticado" });
        return;
      }
      const parameters = req.query;
      const result = await this.shipmentService.getRoutePerformanceMetrics(
        parameters
      );

      res.status(200).json({
        message: "Rutas disponibles, éxito",
        routes: result,
      });
    } catch (error) {
      console.error("Error en getUserShipments:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  async getMonthlyPerformanceMetrics(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = Number(req.user_id);
      if (!userId) {
        res.status(401).json({ message: "Usuario no autenticado" });
        return;
      }
      const parameters = req.query;
      const result = await this.shipmentService.getMonthlyPerformanceMetrics(
        parameters
      );

      res.status(200).json({
        message: "Metricas del mes disponibles, éxito",
        data: result,
      });
    } catch (error) {
      console.error("Error en getUserShipments:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
}

// Exportar una instancia para ser utilizada en las rutas
export const shipmentController = new ShipmentController();
