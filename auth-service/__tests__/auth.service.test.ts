import { AuthService } from "../src/application/auth.service";

// Mock des dépendances externes
jest.mock("../src/config/database", () => ({
  AppDataSource: {
    getMongoRepository: jest.fn(() => ({
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    })),
  },
}));

jest.mock("../src/infrastructure/events/publisher", () => ({
  EventPublisher: {
    publish: jest.fn(),
  },
}));

describe("AuthService", () => {
  let service: AuthService;
  let repoMock: any;

  beforeEach(() => {
    service = new AuthService();
    // Récupère le mock du repo pour chaque test
    repoMock = require("../src/config/database").AppDataSource.getMongoRepository();
    jest.clearAllMocks();
  });

  it("should throw error for invalid email", async () => {
    await expect(
      service.register("invalid", "password123", "John", "Doe", "+1234567890", {
        street: "1 rue de test",
        city: "Paris",
        state: "IDF",
        country: "France",
        postalCode: "75000"
      })
    ).rejects.toThrow("Invalid email format");
  });

  it("should throw error if user already exists", async () => {
    repoMock.findOne.mockResolvedValue({ email: "test@example.com" });
    await expect(
      service.register("test@example.com", "password123", "John", "Doe", "+1234567890", {
        street: "1 rue de test",
        city: "Paris",
        state: "IDF",
        country: "France",
        postalCode: "75000"
      })
    ).rejects.toThrow("User with this email already exists");
  });

  it("should register a user", async () => {
    repoMock.findOne.mockResolvedValue(null);
    repoMock.create.mockReturnValue({
      email: "test@example.com",
      id: "1",
      firstName: "John",
      lastName: "Doe",
      password: "hashed",
      phoneNumber: "+1234567890",
      shippingAddresses: [{}],
      billingAddress: {},
      isActive: true,
      createdAt: new Date(),
      marketingConsent: false,
      preferredCurrency: "USD"
    });
    repoMock.save.mockResolvedValue({ email: "test@example.com" });
    const user = await service.register(
      "test@example.com",
      "password123",
      "John",
      "Doe",
      "+1234567890",
      {
        street: "1 rue de test",
        city: "Paris",
        state: "IDF",
        country: "France",
        postalCode: "75000"
      }
    );
    expect(user).toHaveProperty("email", "test@example.com");
  });

  it("should throw on wrong login", async () => {
    repoMock.findOneBy.mockResolvedValue(null);
    await expect(service.login("wrong@example.com", "password123")).rejects.toThrow();
  });
});

