import request from 'supertest';
import { App } from '../../../../app/App';
import { Server } from '../../../../app/Server';
import { PrismaService } from '../../../../infrastructure/database/prisma/PrismaService';
import { WinstonLogger } from '../../../../infrastructure/logging/Winston.logger';

describe('UserController - CreateUser', () => {
  let app: App;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const logger = new WinstonLogger();
    prismaService = new PrismaService(logger);
    await prismaService.connect();

    const server = new Server();
    app = server.getApp();
  });

  afterAll(async () => {
    await prismaService.disconnect();
  });

  it('should create a new user successfully', async () => {
    const payload = {
      firstName: "John",
      middleName: "M",
      lastName: "Doe",
      email: "john.doe@example.com",
      phoneNumber: "1234567890",
      street: "123 Main St",
      city: "Dhaka",
      state: "Dhaka",
      postalCode: "1205",
      country: "Bangladesh"
    };

    const response = await request(app.app)
      .post('/v1/users/create')  // match your route
      .send(payload)
      .expect(201);

    expect(response.body).toHaveProperty('data');
    expect(response.body.data.email).toBe(payload.email);
    expect(response.body.message).toBe("User Created Successfully");
  });

  it('should fail when required fields are missing', async () => {
    const payload = {
      lastName: "Doe",
      email: "john.doe@example.com",
      phoneNumber: "1234567890",
      street: "123 Main St",
      city: "Dhaka",
      country: "Bangladesh"
    };

    const response = await request(app.app)
      .post('/v1/users/create')
      .send(payload)
      .expect(400);

    expect(response.body).toHaveProperty('errors');
  });
});
