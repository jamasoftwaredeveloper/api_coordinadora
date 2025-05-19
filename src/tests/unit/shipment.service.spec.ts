import { shipmentModel } from "../../infrastructure/persistence/models/shipment.model";
import { ShipmentStatus } from "../../interfaces/order/shipment.interface";

jest.mock("../../infrastructure/persistence/models/shipment.model");

describe("Shipment Service - Unit Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Debería agregar un nuevo envío correctamente", async () => {
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
      status: ShipmentStatus.PENDING,
      content: "Envío de prueba",
    };
    (shipmentModel.create as jest.Mock).mockResolvedValue({ success: true });

    const result = await shipmentModel.create(mockData);

    expect(result).toEqual({ success: true });
    expect(shipmentModel.create).toHaveBeenCalledWith(mockData);
    expect(shipmentModel.create).toHaveBeenCalledTimes(1);
  });

  it("Debería manejar el error al agregar un envío", async () => {
    (shipmentModel.create as jest.Mock).mockRejectedValue(
      new Error("Error al crear envío")
    );

    await expect(
      shipmentModel.create({
        userId: 1,
        packageInfo: {
          weight: 2,
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
        status: ShipmentStatus.PENDING,
      })
    ).rejects.toThrow(
      "Error al crear envío"
    );
  });
});
