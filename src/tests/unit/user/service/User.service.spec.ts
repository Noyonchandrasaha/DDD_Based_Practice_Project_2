// ============================================================
// FILE: src/tests/unit/user/service/User.service.spec.ts
// ============================================================

import { UserService } from '../../../../modules/user/service/User.service';
import { CreateUserCommand } from '../../../../modules/user/application/commands/CreateUser.command';
import { PrismaClient } from '../../../../../generated/prisma';
import { UserMapper } from '../../../../modules/user/mappers/User.mapper';
import { CreateUserUseCase } from '../../../../modules/user/application/use-cases/CreateUser.usecase';
import { UserResponseDTO } from '../../../../modules/user/dto/UserResponse.dto';
import { User } from '../../../../modules/user/domain/User.entity';

// Import real VOs
import { UserNameVO } from '../../../../modules/user/domain/value-objects/UserName.vo';
import { UserEmailVO } from '../../../../modules/user/domain/value-objects/UserEmail.vo';
import { PhoneNumberVO } from '../../../../modules/user/domain/value-objects/PhoneNumber.vo';
import { AddressVO } from '../../../../modules/user/domain/value-objects/Address.vo';

// Mock dependencies
jest.mock('../../../../modules/user/repository/User.repository');
jest.mock('../../../../modules/user/mappers/User.mapper');
jest.mock('../../../../modules/user/application/use-cases/CreateUser.usecase');
jest.mock('../../../../modules/user/domain/value-objects/UserName.vo');
jest.mock('../../../../modules/user/domain/value-objects/UserEmail.vo');
jest.mock('../../../../modules/user/domain/value-objects/PhoneNumber.vo');
jest.mock('../../../../modules/user/domain/value-objects/Address.vo');
jest.mock('../../../../modules/user/application/commands/CreateUser.command');

describe('UserService', () => {
  let userService: UserService;
  let mockPrisma: jest.Mocked<PrismaClient>;
  let mockUseCaseExecute: jest.Mock;

  const mockCommandInput = (overrides = {}) => ({
    lastName: 'Doe',
    firstName: 'John',
    middleName: null,
    email: 'john@example.com',
    phoneNumber: '+880123456789',
    street: 'Dhanmondi',
    city: 'Dhaka',
    country: 'Bangladesh',
    state: null,
    postalCode: null,
    ...overrides,
  });

  beforeEach(() => {
    mockPrisma = {} as jest.Mocked<PrismaClient>;
    mockUseCaseExecute = jest.fn();

    // Mock UseCase
    (CreateUserUseCase as jest.Mock).mockImplementation(() => ({
      execute: mockUseCaseExecute,
    }));

    // === VO Mocks ===
    (UserNameVO.create as jest.Mock).mockImplementation((last: string, first?: string, middle?: string) => ({
      firstName: first ?? '',
      lastName: last,
      middleName: middle ?? '',
      fullName: jest.fn().mockReturnValue(`${first ?? ''} ${middle ?? ''} ${last}`.trim()),
      props: { lastName: last, firstName: first, middleName: middle },
      equals: jest.fn(),
    }));

    (UserEmailVO.create as jest.Mock).mockImplementation((email: string) => ({
      email,
      props: { value: email },
      equals: jest.fn(),
    }));

    (PhoneNumberVO.create as jest.Mock).mockImplementation((phone: string) => ({
      phoneNumber: phone,
      props: { value: phone },
      equals: jest.fn(),
    }));

    (AddressVO.create as jest.Mock).mockImplementation((street: string, city: string, country: string, state?: string, postalCode?: string) => ({
      street,
      city,
      state: state ?? '',
      postalCode: postalCode ?? '',
      country,
      fullAddress: jest.fn().mockReturnValue([street, city, state, postalCode, country].filter(Boolean).join(', ')),
      props: { street, city, state, postalCode, country },
      equals: jest.fn(),
    }));

    // === MOCK CreateUserCommand.create() to return REAL instance with .execute() ===
    (CreateUserCommand.create as jest.Mock).mockImplementation((input: any) => {
      const cmd = Object.create(CreateUserCommand.prototype);
      Object.assign(cmd, input);
      cmd.execute = jest.fn(); // Required method
      return cmd;
    });

    userService = new UserService(mockPrisma);
  });

  afterEach(() => jest.clearAllMocks());

  // ================================================================
  // SUCCESS: Full valid input
  // ================================================================
  it('should create a user and return DTO with all fields', async () => {
    const commandInput = mockCommandInput({
      firstName: 'John',
      middleName: 'Michael',
      street: '32/A Dhanmondi',
      state: 'Dhaka',
      postalCode: '1209',
    });
    const command = CreateUserCommand.create(commandInput);

    const fakeUser = User.create({
      name: UserNameVO.create('Doe', 'John', 'Michael'),
      email: UserEmailVO.create('john@example.com'),
      phoneNumber: PhoneNumberVO.create('+880123456789'),
      address: AddressVO.create('32/A Dhanmondi', 'Dhaka', 'Bangladesh', 'Dhaka', '1209'),
      isActive: true,
    });
    (fakeUser as any).id = 'uuid-1234';

    const expectedDTO = UserResponseDTO.create(
      'uuid-1234',
      'John',
      'Michael',
      'Doe',
      'john@example.com',
      '+880123456789',
      '32/A Dhanmondi',
      'Dhaka',
      'Dhaka',
      '1209',
      'Bangladesh',
      true,
      expect.any(Date),
      expect.any(Date),
      null
    );

    mockUseCaseExecute.mockResolvedValue(fakeUser);
    (UserMapper.toResponseDTO as jest.Mock).mockReturnValue(expectedDTO);

    const result = await userService.createUser(command);

    expect(mockUseCaseExecute).toHaveBeenCalledWith(command);
    expect(result).toEqual(expectedDTO);
  });

  // ================================================================
  // SUCCESS: Minimal input
  // ================================================================
  it('should create user with minimal required fields', async () => {
    const commandInput = mockCommandInput({
      firstName: null,
      middleName: null,
      street: 'Road 1',
      state: null,
      postalCode: null,
    });
    const command = CreateUserCommand.create(commandInput);

    const fakeUser = User.create({
      name: UserNameVO.create('Doe'),
      email: UserEmailVO.create('john@example.com'),
      phoneNumber: PhoneNumberVO.create('+880123456789'),
      address: AddressVO.create('Road 1', 'Dhaka', 'Bangladesh'),
      isActive: true,
    });
    (fakeUser as any).id = 'uuid-minimal';

    const expectedDTO = UserResponseDTO.create(
      'uuid-minimal',
      null,
      null,
      'Doe',
      'john@example.com',
      '+880123456789',
      'Road 1',
      'Dhaka',
      '',
      '',
      'Bangladesh',
      true,
      expect.any(Date),
      expect.any(Date),
      null
    );

    mockUseCaseExecute.mockResolvedValue(fakeUser);
    (UserMapper.toResponseDTO as jest.Mock).mockReturnValue(expectedDTO);

    const result = await userService.createUser(command);

    expect(result).toEqual(expectedDTO);
  });

  // ================================================================
  // FAILURE: Use case throws
  // ================================================================
  it('should throw when use case fails', async () => {
    const commandInput = mockCommandInput({ email: 'fail@example.com' });
    const command = CreateUserCommand.create(commandInput);

    const error = new Error('Database connection failed');
    mockUseCaseExecute.mockRejectedValue(error);

    await expect(userService.createUser(command)).rejects.toThrow('Database connection failed');
    expect(mockUseCaseExecute).toHaveBeenCalledWith(command);
  });

  // ================================================================
  // FAILURE: Zod validation (real command)
  // ================================================================
  it('should throw ZodError when command input is invalid', () => {
    jest.unmock('../../../../modules/user/application/commands/CreateUser.command');
    const { CreateUserCommand: RealCmd } = require('../../../../modules/user/application/commands/CreateUser.command');

    const invalidInput = {
      lastName: '',
      email: 'not-an-email',
      phoneNumber: '123',
      street: '',
      city: '',
      country: '',
    };

    expect(() => RealCmd.create(invalidInput)).toThrow('Last Name is required');
    expect(() => RealCmd.create(invalidInput)).toThrow('Invalid email');
    expect(() => RealCmd.create(invalidInput)).toThrow('Invalid phone number format');
  });

  // ================================================================
  // EDGE: Long names
  // ================================================================
  it('should handle long but valid names', async () => {
    const longName = 'A'.repeat(50);
    const commandInput = mockCommandInput({
      lastName: longName,
      firstName: longName,
      middleName: longName,
    });
    const command = CreateUserCommand.create(commandInput);

    const fakeUser = User.create({
      name: UserNameVO.create(longName, longName, longName),
      email: UserEmailVO.create('long@example.com'),
      phoneNumber: PhoneNumberVO.create('+880123456789'),
      address: AddressVO.create('Street', 'City', 'Country'),
      isActive: true,
    });
    (fakeUser as any).id = 'uuid-long';

    mockUseCaseExecute.mockResolvedValue(fakeUser);
    (UserMapper.toResponseDTO as jest.Mock).mockImplementation((user: any) => ({
      id: user.id,
      firstName: user.name.firstName,
      middleName: user.name.middleName,
      lastName: user.name.lastName,
      email: user.email.email,
      phoneNumber: user.phoneNumber.phoneNumber,
      street: user.address.street,
      city: user.address.city,
      state: user.address.state,
      postalCode: user.address.postalCode,
      country: user.address.country,
      isActive: user.isActive,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      deletedAt: null,
    }));

    const result = await userService.createUser(command);

    expect(result.firstName).toBe(longName);
    expect(result.lastName).toBe(longName);
  });

  // ================================================================
  // EDGE: Formatted phone
  // ================================================================
  it('should handle phone numbers with formatting', async () => {
    const formattedPhone = '(880) 123-456 789';
    const commandInput = mockCommandInput({ phoneNumber: formattedPhone });
    const command = CreateUserCommand.create(commandInput);

    const fakeUser = User.create({
      name: UserNameVO.create('Doe'),
      email: UserEmailVO.create('john@example.com'),
      phoneNumber: PhoneNumberVO.create(formattedPhone),
      address: AddressVO.create('Street', 'Dhaka', 'Bangladesh'),
      isActive: true,
    });
    (fakeUser as any).id = 'uuid-phone';

    mockUseCaseExecute.mockResolvedValue(fakeUser);
    (UserMapper.toResponseDTO as jest.Mock).mockReturnValue(
      UserResponseDTO.create(
        'uuid-phone',
        null,
        null,
        'Doe',
        'john@example.com',
        formattedPhone,
        'Street',
        'Dhaka',
        '',
        '',
        'Bangladesh',
        true,
        expect.any(Date),
        expect.any(Date),
        null
      )
    );

    const result = await userService.createUser(command);
    expect(result.phoneNumber).toBe(formattedPhone);
  });

  // ================================================================
  // EDGE: Special characters in name
  // ================================================================
  it('should allow special characters in name if regex permits', async () => {
    const commandInput = mockCommandInput({
      lastName: "O'Connor",
      firstName: 'José',
    });
    const command = CreateUserCommand.create(commandInput);

    const fakeUser = User.create({
      name: UserNameVO.create("O'Connor", 'José'),
      email: UserEmailVO.create('jose@example.com'),
      phoneNumber: PhoneNumberVO.create('+880123456789'),
      address: AddressVO.create('Street', 'Dhaka', 'Bangladesh'),
      isActive: true,
    });
    (fakeUser as any).id = 'uuid-special';

    mockUseCaseExecute.mockResolvedValue(fakeUser);
    (UserMapper.toResponseDTO as jest.Mock).mockReturnValue(
      UserResponseDTO.create(
        'uuid-special',
        'José',
        null,
        "O'Connor",
        'jose@example.com',
        '+880123456789',
        'Street',
        'Dhaka',
        '',
        '',
        'Bangladesh',
        true,
        expect.any(Date),
        expect.any(Date),
        null
      )
    );

    const result = await userService.createUser(command);
    expect(result.lastName).toBe("O'Connor");
  });
});
