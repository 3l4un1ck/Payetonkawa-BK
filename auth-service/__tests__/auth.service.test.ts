import { AuthService } from "../src/application/auth.service";
import { AppDataSource } from "../src/config/database";

beforeAll(async () => {
    await AppDataSource.initialize();
});

afterAll(async () => {
    await AppDataSource.destroy();
});

describe("AuthService", () => {
    const service = new AuthService();

    it("should register a user", async () => {
        const user = await service.register("test@example.com", "password123");
        expect(user).toHaveProperty("email", "test@example.com");
    });

    it("should throw on wrong login", async () => {
        await expect(service.login("wrong@example.com", "password123")).rejects.toThrow();
    });
});
