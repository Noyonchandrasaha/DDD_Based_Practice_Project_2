// ============================================================
// FILE: src/tests/unit/user/commands/CreateUser.command.spec.ts
// ============================================================

import { CreateUserCommand } from '../../../../modules/user/application/commands/CreateUser.command';

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

describe('CreateUserCommand', () => {
  describe('create() – validation', () => {
    it('accepts valid input', () => {
      const input = USER_SEEDS[0];
      expect(() => CreateUserCommand.create(input)).not.toThrow();
    });

    it('throws on missing required field (lastName)', () => {
      const input = { ...USER_SEEDS[0], lastName: undefined };
      expect(() => CreateUserCommand.create(input)).toThrow();
      expect(() => CreateUserCommand.create(input)).toThrow(/lastName/i);
    });

    it('throws on invalid email', () => {
      const input = { ...USER_SEEDS[0], email: 'invalid' };
      expect(() => CreateUserCommand.create(input)).toThrow();
      expect(() => CreateUserCommand.create(input)).toThrow(/email/i);
    });

    it('throws on invalid phone format', () => {
      const input = { ...USER_SEEDS[0], phoneNumber: '123' };
      expect(() => CreateUserCommand.create(input)).toThrow();
      expect(() => CreateUserCommand.create(input)).toThrow(/phone/i);
    });

    it('throws on missing required address fields', () => {
      const input = { ...USER_SEEDS[0], street: '', city: '', country: '' };
      expect(() => CreateUserCommand.create(input)).toThrow();
    });
  });

  describe('properties – null / undefined handling', () => {
    it('preserves null as null', () => {
      const input = { ...USER_SEEDS[0], firstName: null, state: null };
      const command = CreateUserCommand.create(input);
      expect(command.firstName).toBeNull();
      expect(command.state).toBeNull();
    });

    it('converts undefined to null (consistent with null)', () => {
      const input = { ...USER_SEEDS[0], firstName: undefined, state: undefined };
      const command = CreateUserCommand.create(input);
      expect(command.firstName).toBeNull();  // ← now matches constructor
      expect(command.state).toBeNull();
    });
  });
});