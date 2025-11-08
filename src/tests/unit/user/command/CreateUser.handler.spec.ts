// ============================================================
// FILE: src/tests/unit/user/handlers/CreateUser.handler.spec.ts
// ============================================================

import { CreateUserHandler } from '../../../../modules/user/application/commands/CreateUser.handler';
import { CreateUserCommand } from '../../../../modules/user/application/commands/CreateUser.command';
import { UserCreatedEvent } from '../../../../modules/user/domain/events/UserCreated.event';
import { User } from '../../../../modules/user/domain/User.entity';
import { UserMapper } from '../../../../modules/user/mappers/User.mapper';
import { CreateUserDTO } from '../../../../modules/user/dto/CreateUser.dto';

// Re-use seeds
const USER_SEEDS = [
  {
    firstName: 'John',
    middleName: 'M',
    lastName: 'Doe',
    email: 'john@example.com',
    phoneNumber: '+1234567890',
    street: '123 Main St',
    city: 'NYC',
    state: 'NY',
    postalCode: '10001',
    country: 'USA',
  },
  {
    firstName: null,
    middleName: null,
    lastName: 'Nguyen',
    email: 'nguyen@vn.vn',
    phoneNumber: '+84912345678',
    street: '123 Tran Hung Dao',
    city: 'Ho Chi Minh',
    state: null,
    postalCode: null,
    country: 'Vietnam',
  },
];

describe('CreateUserHandler', () => {
  let handler: CreateUserHandler;

  beforeEach(() => {
    handler = new CreateUserHandler();
  });

  describe('execute() – domain creation', () => {
    USER_SEEDS.forEach((seed, idx) => {
      it(`creates user with correct values (seed #${idx + 1})`, async () => {
        const command = CreateUserCommand.create(seed);

        // === SPY ON MAPPER (optional, for isolation) ===
        const toDomainPropsSpy = jest.spyOn(UserMapper, 'toDomainProps');
        const createSpy = jest.spyOn(User, 'create');

        // === Execute handler ===
        const user = await handler.execute(command);

        // === 1. Audit Fields ===
        const userAny = user as any;
        expect(userAny.id).toBeDefined();
        expect(userAny.id).toMatch(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        );
        expect(userAny.createdAt).toBeInstanceOf(Date);
        expect(userAny.updatedAt).toBeInstanceOf(Date);
        expect(userAny.createdAt.getTime()).toBe(userAny.updatedAt.getTime());

        // === 2. Domain Values (via public getters) ===
        expect(user.name.firstName).toBe(seed.firstName ?? undefined);
        expect(user.name.middleName).toBe(seed.middleName ?? undefined);
        expect(user.name.lastName).toBe(seed.lastName);
        expect(user.name.fullName()).toBe(
          [seed.firstName, seed.middleName, seed.lastName].filter(Boolean).join(' ')
        );

        expect(user.email.email).toBe(seed.email);
        expect(user.phoneNumber.phoneNumber).toBe(seed.phoneNumber);

        expect(user.address.street).toBe(seed.street);
        expect(user.address.city).toBe(seed.city);
        expect(user.address.state).toBe(seed.state ?? undefined);
        expect(user.address.postalCode).toBe(seed.postalCode ?? undefined);
        expect(user.address.country).toBe(seed.country);

        expect(user.isActive).toBe(true);

        // === 3. Domain Event ===
        expect(userAny.domainEvents).toHaveLength(1);
        const event = userAny.domainEvents[0];
        expect(event).toBeInstanceOf(UserCreatedEvent);
        expect(event.payload.userId).toBe(userAny.id);
        expect(event.payload.fullName).toBe(user.name.fullName());
        expect(event.payload.email).toBe(user.email.email);
        expect(event.payload.phoneNumber).toBe(user.phoneNumber.phoneNumber);
        expect(event.payload.address).toBe(user.address.fullAddress());
        expect(event.payload.isActive).toBe(true);

        // === 4. Verify Mapper & User.create were called ===
        expect(toDomainPropsSpy).toHaveBeenCalledTimes(1);
        const expectedDTO = CreateUserDTO.create({
          firstName: seed.firstName ?? undefined,
          middleName: seed.middleName ?? undefined,
          lastName: seed.lastName,
          email: seed.email,
          phoneNumber: seed.phoneNumber,
          street: seed.street,
          city: seed.city,
          state: seed.state ?? undefined,
          postalCode: seed.postalCode ?? undefined,
          country: seed.country,
        });
        expect(toDomainPropsSpy).toHaveBeenCalledWith(expectedDTO);

        expect(createSpy).toHaveBeenCalledTimes(1);
        expect(createSpy).toHaveBeenCalledWith(expect.objectContaining({
          name: expect.anything(),
          email: expect.anything(),
          phoneNumber: expect.anything(),
          address: expect.anything(),
          isActive: true,
        }));

        // Cleanup
        toDomainPropsSpy.mockRestore();
        createSpy.mockRestore();
      });
    });

    it('handles null → undefined for optional fields', async () => {
      const input = {
        ...USER_SEEDS[0],
        firstName: null,
        middleName: null,
        state: null,
        postalCode: null,
      };
      const command = CreateUserCommand.create(input);
      const user = await handler.execute(command);

      expect(user.name.firstName).toBeUndefined();
      expect(user.name.middleName).toBeUndefined();
      expect(user.address.state).toBeUndefined();
      expect(user.address.postalCode).toBeUndefined();
    });

    it('handles missing optional fields (undefined)', async () => {
      const input = {
        ...USER_SEEDS[0],
        firstName: undefined,
        middleName: undefined,
        state: undefined,
        postalCode: undefined,
      };
      const command = CreateUserCommand.create(input);
      const user = await handler.execute(command);

      expect(user.name.firstName).toBeUndefined();
      expect(user.name.middleName).toBeUndefined();
      expect(user.address.state).toBeUndefined();
      expect(user.address.postalCode).toBeUndefined();
    });
  });
});