import { Router } from "express";
import { validateBodyAuth } from "../middlewares/auth/registerValidation";
import { shipmentController } from "../controllers/shipment.controller";
import { validateShipmentMiddleware } from "../middlewares/shipment/validate-shipment.middleware";
const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Ordenes de envio
 *     description: Endpoints para envios
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
 * /api/shipment:
 *   post:
 *     summary: Registra una orden de envío
 *     tags: [Ordenes de envio]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: number
 *               packageInfo:
 *                 type: object
 *                 description: "Información del paquete"
 *                 properties:
 *                   weight:
 *                     type: number
 *                     description: Peso del paquete
 *                   height:
 *                     type: number
 *                     description: Altura del paquete
 *                   width:
 *                     type: number
 *                     description: Ancho del paquete
 *                   length:
 *                     type: number
 *                     description: Largo del paquete
 *                   productType:
 *                     type: string
 *                     description: Tipo de producto
 *               exitAddress:
 *                 type: object
 *                 description: "Dirección de salida"
 *                 properties:
 *                   street:
 *                     type: string
 *                     description: "Calle de la dirección"
 *                   city:
 *                     type: string
 *                     description: "Ciudad de destino"
 *                   state:
 *                     type: string
 *                     description: "Estado o provincia"
 *                   postalCode:
 *                     type: string
 *                     description: "Código postal"
 *                   country:
 *                     type: string
 *                     description: "País de destino"
 *                   recipientName:
 *                     type: string
 *                     description: "Nombre del destinatario"
 *                   recipientPhone:
 *                     type: string
 *                     description: "Teléfono del destinatario"
 *               destinationAddress:
 *                 type: object
 *                 description: "Dirección de destino"
 *                 properties:
 *                   street:
 *                     type: string
 *                     description: "Calle de la dirección"
 *                   city:
 *                     type: string
 *                     description: "Ciudad de destino"
 *                   state:
 *                     type: string
 *                     description: "Estado o provincia"
 *                   postalCode:
 *                     type: string
 *                     description: "Código postal"
 *                   country:
 *                     type: string
 *                     description: "País de destino"
 *                   recipientName:
 *                     type: string
 *                     description: "Nombre del destinatario"
 *                   recipientPhone:
 *                     type: string
 *                     description: "Teléfono del destinatario"
 *     responses:
 *       201:
 *         description: "Orden de envío creada con éxito"
 *       409:
 *         description: "Conflicto: Datos ya existentes"
 *       500:
 *         description: "Error del servidor"
 */
router.post(
  "/api/shipment",
  validateShipmentMiddleware,
  validateBodyAuth.authorization,
  shipmentController.createShipment.bind(shipmentController)
);

/**
 * @swagger
 * /api/shipment/userShipments/{search}/{routeId}/{transporterId}/{dateStart}/{dateEnd}:
 *   get:
 *     summary: Obtiene los envíos de un usuario
 *     tags: [Órdenes de envío]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: search
 *         schema:
 *           type: string
 *         required: false
 *         description: Número de tracking para buscar envíos
 *       - in: path
 *         name: routeId
 *         schema:
 *           type: string
 *         required: false
 *         description: ID de la ruta del envío
 *       - in: path
 *         name: transporterId
 *         schema:
 *           type: string
 *         required: false
 *         description: ID del transportista
 *       - in: path
 *         name: dateStart
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Fecha de inicio del envío
 *       - in: path
 *         name: dateEnd
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Fecha de finalización del envío
 *     responses:
 *       200:
 *         description: Envíos obtenidos con éxito
 *       401:
 *         description: Usuario no autenticado
 *       500:
 *         description: Error interno del servidor
 */
router.get(
  "/api/shipment/userShipments",
  validateBodyAuth.authorization,
  shipmentController.getUserShipments.bind(shipmentController)
);

/**
 * @swagger
 * /api/shipment/trackingNumber:
 *   get:
 *     summary: Obtiene los envios por trackingNumber
 *     tags: [Ordenes de envio]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: trackingNumber
 *         schema:
 *           type: string
 *         required: true
 *         description: Número de tracking para buscar envíos
 *     responses:
 *       200:
 *         description: Envíos obtenidos con éxito
 *       401:
 *         description: Usuario no autenticado
 *       500:
 *         description: Error interno del servidor
 */
router.get(
  "/api/shipment/trackingNumber",
  validateBodyAuth.authorization,
  shipmentController.findByTrackingNumber.bind(shipmentController)
);

/**
 * @swagger
 * /api/shipment/updateStatus:
 *   put:
 *     summary: Actualiza el estado de un envío
 *     tags: [Ordenes de envio]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *                 description: ID del envío
 *               status:
 *                 type: string
 *                 description: Nuevo estado del envío
 *     responses:
 *       200:
 *         description: Estado actualizado con éxito
 *       400:
 *         description: Error al actualizar el estado
 *       401:
 *         description: Usuario no autenticado
 *       500:
 *         description: Error interno del servidor
 */

router.put(
  "/api/shipment/updateStatus",
  validateBodyAuth.authorization,
  shipmentController.updateStatus.bind(shipmentController)
);
/**
 * @swagger
 * /api/shipment/assignRoute:
 *   put:
 *     summary: Asigna una ruta a un envío
 *     tags: [Ordenes de envio]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *                 description: ID del envío
 *               routeId:
 *                 type: number
 *                 description: ID de la ruta
 *               transporterId:
 *                 type: number
 *                 description: ID del transportista
 *     responses:
 *       200:
 *         description: Ruta asignada con éxito
 *       400:
 *         description: Error al asignar la ruta
 *       401:
 *         description: Usuario no autenticado
 */
router.put(
  "/api/shipment/assignRoute",
  validateBodyAuth.authorization,
  shipmentController.assignRouteToShipment.bind(shipmentController)
);

/**
 * @swagger
 * /api/shipment/allRoutes:
 *   get:
 *     summary: Obtiene todas las rutas
 *     tags: [Ordenes de envio]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Rutas obtenidas con éxito
 *       401:
 *         description: Usuario no autenticado
 *       500:
 *         description: Error interno del servidor
 */
router.get(
  "/api/shipment/allRoutes",
  validateBodyAuth.authorization,
  shipmentController.allRoutes.bind(shipmentController)
);

/**
 * @swagger
 * /api/shipment/allTransporters:
 *   get:
 *     summary: Obtiene todos los transportistas
 *     tags: [Ordenes de envio]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Transportistas obtenidos con éxito
 *       401:
 *         description: Usuario no autenticado
 *       500:
 *         description: Error interno del servidor
 */
router.get(
  "/api/shipment/allTransporters",
  validateBodyAuth.authorization,
  shipmentController.allTransporters.bind(shipmentController)
);

export default router;
