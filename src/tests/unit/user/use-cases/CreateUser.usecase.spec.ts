// ============================================================
// FILE: src/tests/unit/user/use-cases/CreateUser.usecase.spec.ts
// ============================================================

import { CreateUserUseCase } from '../../../../modules/user/application/use-cases/CreateUser.usecase';
import { CreateUserCommand } from '../../../../modules/user/application/commands/CreateUser.command';
import { CreateUserHandler } from '../../../../modules/user/application/commands/CreateUser.handler';
import { UserRepository } from '../../../../modules/user/repository/User.repository';
import { User } from '../../../../modules/user/domain/User.entity';
import { UserCreatedEvent } from '../../../../modules/user/domain//events/UserCreated.event';
import { UserNameVO } from '../../../../modules/user/domain/value-objects/UserName.vo';
import { UserEmailVO } from '../../../../modules/user/domain/value-objects/UserEmail.vo';
import { PhoneNumberVO } from '../../../../modules/user/domain/value-objects/PhoneNumber.vo';
import { AddressVO } from '../../../../modules/user/domain/value-objects/Address.vo';

interface UserSeed {
  firstName?: string | null;
  middleName?: string | null;
  lastName: string;
  email: string;
  phoneNumber: string;
  street: string;
  city: string;
  state?: string | null;
  postalCode?: string | null;
  country: string;
}

const USER_SEEDS: UserSeed[] = [
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
    firstName: 'Jane',
    middleName: null,
    lastName: 'Smith',
    email: 'jane@smith.org',
    phoneNumber: '+1987654321',
    street: '456 Oak Ave',
    city: 'Los Angeles',
    state: 'CA',
    postalCode: '90210',
    country: 'USA',
  },
  {
    firstName: null,
    middleName: 'X',
    lastName: 'Brown',
    email: 'brown@example.net',
    phoneNumber: '+1122334455',
    street: '789 Elm Rd',
    city: 'Chicago',
    state: 'IL',
    postalCode: null,
    country: 'USA',
  },
  {
    firstName: 'Carlos',
    middleName: 'A',
    lastName: 'García',
    email: 'carlos@garcia.es',
    phoneNumber: '+34123456789',
    street: 'Calle Mayor 12',
    city: 'Madrid',
    state: null,
    postalCode: '28013',
    country: 'Spain',
  },
  {
    firstName: 'Maria',
    middleName: null,
    lastName: 'Silva',
    email: 'maria.silva@br.com',
    phoneNumber: '+5511987654321',
    street: 'Av. Paulista 1000',
    city: 'São Paulo',
    state: 'SP',
    postalCode: '01310-100',
    country: 'Brazil',
  },
  {
    firstName: 'Liam',
    middleName: 'J',
    lastName: 'Wilson',
    email: 'liam.w@au.com',
    phoneNumber: '+61412345678',
    street: '12 George St',
    city: 'Sydney',
    state: 'NSW',
    postalCode: '2000',
    country: 'Australia',
  },
  {
    firstName: 'Aisha',
    middleName: null,
    lastName: 'Khan',
    email: 'aisha@khan.pk',
    phoneNumber: '+923001234567',
    street: 'House 45, Street 3',
    city: 'Lahore',
    state: null,
    postalCode: '54000',
    country: 'Pakistan',
  },
  {
    firstName: 'Olga',
    middleName: 'V',
    lastName: 'Ivanova',
    email: 'olga.ivanova@ru.ru',
    phoneNumber: '+79161234567',
    street: 'ул. Ленина 78',
    city: 'Moscow',
    state: 'Moscow',
    postalCode: '101000',
    country: 'Russia',
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
  {
    firstName: 'Emma',
    middleName: 'R',
    lastName: 'Taylor',
    email: 'emma.taylor@ca.ca',
    phoneNumber: '+14165551234',
    street: '321 Maple Dr',
    city: 'Toronto',
    state: 'ON',
    postalCode: 'M5V 2T6',
    country: 'Canada',
  },
];

/* ------------------------------------------------------------------ */
/* Helper – build a *real* User via public factories ONLY            */
/* Uses `undefined` for absent fields (VO factories accept it)       */
/* ------------------------------------------------------------------ */
function buildUserFromSeed(seed: UserSeed, id = 'test-id'): User {
  const name = UserNameVO.create(
    seed.lastName,
    seed.firstName ?? undefined,
    seed.middleName ?? undefined
  );

  const email = UserEmailVO.create(seed.email);
  const phone = PhoneNumberVO.create(seed.phoneNumber);

  const address = AddressVO.create(
    seed.street,
    seed.city,
    seed.country,
    seed.state ?? undefined,
    seed.postalCode ?? undefined
  );

  const user = User.create({
    name,
    email,
    phoneNumber: phone,
    address,
    isActive: true,
  });

  // Deterministic id / timestamps – **only in tests**
  (user as any)._id = id;
  (user as any).createdAt = new Date('2025-01-01');
  (user as any).updatedAt = new Date('2025-01-01');

  return user;
}

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let mockRepo: jest.Mocked<UserRepository>;
  let handlerSpy: jest.SpyInstance;

  beforeEach(() => {
    mockRepo = { create: jest.fn() } as any;
    useCase = new CreateUserUseCase(mockRepo);
    handlerSpy = jest.spyOn(CreateUserHandler.prototype, 'execute');
  });

  afterEach(() => {
    handlerSpy.mockRestore();
  });

  /* -------------------------------------------------------------- */
  /* SUCCESS – 10 seeds                                            */
  /* -------------------------------------------------------------- */
  describe('success cases', () => {
    USER_SEEDS.forEach((seed, idx) => {
      it(`creates user and persists (seed #${idx + 1})`, async () => {
        const command = CreateUserCommand.create(seed);
        const expectedId = `user-${idx + 1}`;
        const fakeUser = buildUserFromSeed(seed, expectedId);

        handlerSpy.mockResolvedValue(fakeUser);

        const result = await useCase.execute(command);

        expect(handlerSpy).toHaveBeenCalledWith(command);
        expect(mockRepo.create).toHaveBeenCalledWith(fakeUser);
        expect(result).toBe(fakeUser);
      });
    });
  });

  /* -------------------------------------------------------------- */
  /* VALIDATION ERRORS – Zod throws BEFORE execute()               */
  /* -------------------------------------------------------------- */
  describe('validation errors', () => {
    it('throws when lastName is missing', () => {
      const badInput = { ...USER_SEEDS[0], lastName: undefined };
      expect(() => CreateUserCommand.create(badInput)).toThrow();
      expect(mockRepo.create).not.toHaveBeenCalled();
    });

    it('throws when email is invalid', () => {
      const badInput = { ...USER_SEEDS[0], email: 'bad' };
      expect(() => CreateUserCommand.create(badInput)).toThrow();
      expect(mockRepo.create).not.toHaveBeenCalled();
    });

    it('throws when phone number is invalid', () => {
      const badInput = { ...USER_SEEDS[0], phoneNumber: '123' };
      expect(() => CreateUserCommand.create(badInput)).toThrow();
      expect(mockRepo.create).not.toHaveBeenCalled();
    });
  });

  /* -------------------------------------------------------------- */
  /* REPOSITORY ERRORS                                             */
  /* -------------------------------------------------------------- */
  describe('repository errors', () => {
    it('propagates error when repo.create() fails', async () => {
      const command = CreateUserCommand.create(USER_SEEDS[0]);
      const fakeUser = buildUserFromSeed(USER_SEEDS[0], 'repo-err');

      handlerSpy.mockResolvedValue(fakeUser);
      mockRepo.create.mockRejectedValue(new Error('DB error'));

      await expect(useCase.execute(command)).rejects.toThrow('DB error');
      expect(mockRepo.create).toHaveBeenCalled();
    });
  });

  /* -------------------------------------------------------------- */
  /* OPTIONAL FIELDS (null → undefined)                           */
  /* -------------------------------------------------------------- */
  describe('optional fields', () => {
    it('handles null values correctly', async () => {
      const input = {
        ...USER_SEEDS[0],
        firstName: null,
        middleName: null,
        state: null,
        postalCode: null,
      };

      const command = CreateUserCommand.create(input);
      const fakeUser = buildUserFromSeed(input, 'opt-null');

      handlerSpy.mockResolvedValue(fakeUser);

      const result = await useCase.execute(command);

      expect(result.name.firstName).toBeUndefined();
      expect(result.name.middleName).toBeUndefined();
      expect(result.address.state).toBeUndefined();
      expect(result.address.postalCode).toBeUndefined();
    });
  });

  /* -------------------------------------------------------------- */
  /* DOMAIN EVENTS                                                 */
  /* -------------------------------------------------------------- */
  describe('domain events', () => {
    it('preserves UserCreatedEvent from handler', async () => {
      const command = CreateUserCommand.create(USER_SEEDS[0]);
      const event = new UserCreatedEvent({
        userId: 'evt-1',
        fullName: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '+1234567890',
        address: '123 Main St, NYC, USA',
        isActive: true,
      });

      const fakeUser = buildUserFromSeed(USER_SEEDS[0], 'evt-1');
      (fakeUser as any).domainEvents = [event];

      handlerSpy.mockResolvedValue(fakeUser);

      const result = await useCase.execute(command);

      expect((result as any).domainEvents[0]).toBe(event);
    });
  });

  /* -------------------------------------------------------------- */
  /* NO SIDE-EFFECTS ON VALIDATION FAILURE                        */
  /* -------------------------------------------------------------- */
  describe('no side effects', () => {
    it('does not call repo.create() on validation failure', () => {
      const badInput = { email: 'x' }; // invalid
      expect(() => CreateUserCommand.create(badInput)).toThrow();
      expect(mockRepo.create).not.toHaveBeenCalled();
    });
  });
});