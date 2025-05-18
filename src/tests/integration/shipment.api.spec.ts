import request from "supertest";
import { server } from "../../server";
import { shipmentModel } from "../../infrastructure/persistence/models/shipment.model";
import { ShipmentStatus } from "../../interfaces/order/shipment.interface";

jest.mock("../../infrastructure/persistence/models/shipment.model");

describe("Shipment API - Integration Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("POST /api/shipment - Debería registrar un envío", async () => {
    const user = {
      name: "admin@gmail.com",
      password: "123456789",
    };

    // Autenticación para obtener el token
    const auth = await request(server).post("/apí/auth/login").send(user);

    console.log("auth", auth);

    const token = auth.body.token; // Suponiendo que el token viene en el cuerpo de la respuesta

    const mockData = {
      userId: 1,
      packageInfo: {
        weight: 2,
        dimensions: "10x10x10",
        height: 10,
        width: 10,
        length: 10,
        productType: "General",
      },
      exitAddress: {
        street: "Calle 123 #45-67",
        city: "Bogotá",
        state: "Cundinamarca",
        postalCode: "110111",
        country: "Colombia",
        recipientName: "Jefry Martínez",
        recipientPhone: "+57 321 456 7890",
        additionalInfo: "Apartamento 302, Edificio Los Cedros",
      },
      destinationAddress: {
        street: "Calle 123 #45-67",
        city: "Bogotá",
        state: "Cundinamarca",
        postalCode: "110111",
        country: "Colombia",
        recipientName: "Jefry Martínez",
        recipientPhone: "+57 321 456 7890",
        additionalInfo: "Apartamento 302, Edificio Los Cedros",
      },
      status: "Pending",
      content: "Envío de prueba",
    };

    // Mockear la creación del envío
    (shipmentModel.create as jest.Mock).mockResolvedValue({ success: true });

    // Realizar el POST de envío con el token en el header
    const response = await request(server)
      .post("/api/shipment")
      .set("Authorization", `Bearer ${token}`) // Enviar el token
      .send(mockData);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Envío registrado correctamente");
  });

  it("POST /api/shipment - Debería manejar el error al registrar un envío", async () => {
    (shipmentModel.create as jest.Mock).mockRejectedValue(
      new Error("Error al crear envío")
    );

    const response = await request(server).post("/api/shipment").send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Error al registrar el envío");
  });
});
