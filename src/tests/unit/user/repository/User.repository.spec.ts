// FILE: tests/unit/repositories/UserRepository.test.ts

import { UserRepository } from '../../../../modules/user/repository/User.repository';
import { User, UserProps } from '../../../../modules/user/domain/User.entity';
import { UserNameVO } from '../../../../modules/user/domain/value-objects/UserName.vo';
import { UserEmailVO } from '../../../../modules/user/domain/value-objects/UserEmail.vo';
import { PhoneNumberVO } from '../../../../modules/user/domain/value-objects/PhoneNumber.vo';
import { AddressVO } from '../../../../modules/user/domain/value-objects/Address.vo';
import { PrismaClient } from '../../../../../generated/prisma';
import { QueryParams } from '../../../../core/types/QueryParams.type';
import { PaginatedResult } from '../../../../core/types/Pagination.type';

// Mock Prisma client
const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
} as unknown as PrismaClient;

// Test Data Sets
const testUsersData = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phoneNumber: '+1234567890',
    address: '123 Main St, New York, NY, 10001, USA',
    isActive: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-02'),
    deletedAt: null,
  },
  {
    id: 'user-2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phoneNumber: '+1987654321',
    address: '456 Oak Ave, Los Angeles, CA, 90210, USA',
    isActive: true,
    createdAt: new Date('2023-02-01'),
    updatedAt: new Date('2023-02-02'),
    deletedAt: null,
  },
  {
    id: 'user-3',
    name: 'Bob Michael Johnson',
    email: 'bob.johnson@example.com',
    phoneNumber: '+1122334455',
    address: '789 Pine Rd, Chicago, IL, 60601, USA',
    isActive: false,
    createdAt: new Date('2023-03-01'),
    updatedAt: new Date('2023-03-02'),
    deletedAt: null,
  },
  {
    id: 'user-4',
    name: 'Alice Brown',
    email: 'alice.brown@example.com',
    phoneNumber: '+1555666777',
    address: '321 Elm St, Houston, TX, 77001, USA',
    isActive: true,
    createdAt: new Date('2023-04-01'),
    updatedAt: new Date('2023-04-02'),
    deletedAt: new Date('2023-06-01'),
  },
  {
    id: 'user-5',
    name: 'Charlie Wilson Davis',
    email: 'charlie.wilson@example.com',
    phoneNumber: '+1444333222',
    address: '654 Maple Dr, Phoenix, AZ, 85001, USA',
    isActive: true,
    createdAt: new Date('2023-05-01'),
    updatedAt: new Date('2023-05-02'),
    deletedAt: null,
  }
];

// Domain props for creating users
const testUserProps = [
  {
    name: UserNameVO.create('Doe', 'John'),
    email: UserEmailVO.create('john.doe@example.com'),
    phoneNumber: PhoneNumberVO.create('+1234567890'),
    address: AddressVO.create('123 Main St', 'New York', 'USA', 'NY', '10001'),
    isActive: true,
  },
  {
    name: UserNameVO.create('Smith', 'Jane'),
    email: UserEmailVO.create('jane.smith@example.com'),
    phoneNumber: PhoneNumberVO.create('+1987654321'),
    address: AddressVO.create('456 Oak Ave', 'Los Angeles', 'USA', 'CA', '90210'),
    isActive: true,
  },
  {
    name: UserNameVO.create('Johnson', 'Bob', 'Michael'),
    email: UserEmailVO.create('bob.johnson@example.com'),
    phoneNumber: PhoneNumberVO.create('+1122334455'),
    address: AddressVO.create('789 Pine Rd', 'Chicago', 'USA', 'IL', '60601'),
    isActive: false,
  },
  {
    name: UserNameVO.create('Brown', 'Alice'),
    email: UserEmailVO.create('alice.brown@example.com'),
    phoneNumber: PhoneNumberVO.create('+1555666777'),
    address: AddressVO.create('321 Elm St', 'Houston', 'USA', 'TX', '77001'),
    isActive: true,
  },
  {
    name: UserNameVO.create('Davis', 'Charlie', 'Wilson'),
    email: UserEmailVO.create('charlie.wilson@example.com'),
    phoneNumber: PhoneNumberVO.create('+1444333222'),
    address: AddressVO.create('654 Maple Dr', 'Phoenix', 'USA', 'AZ', '85001'),
    isActive: true,
  }
];

describe('UserRepository', () => {
  let userRepository: UserRepository;

  beforeEach(() => {
    userRepository = new UserRepository(mockPrisma);
    jest.clearAllMocks();
  });

  // ==================== CRUD Operations Tests ====================

  describe('CRUD Operations', () => {
    describe('findById', () => {
      testUsersData.forEach((userData, index) => {
        it(`should return user ${index + 1} when found by ID`, async () => {
          (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(userData);

          const result = await userRepository.findById(userData.id);

          expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
            where: { id: userData.id },
          });
          expect(result).toBeInstanceOf(User);
          expect(result?.toPrimitives().id).toBe(userData.id);
        });
      });

      it('should return null when user not found', async () => {
        (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null);

        const result = await userRepository.findById('non-existent-id');

        expect(result).toBeNull();
      });

      it('should handle database errors', async () => {
        (mockPrisma.user.findUnique as jest.Mock).mockRejectedValue(new Error('DB Error'));

        await expect(userRepository.findById('user-1')).rejects.toThrow('DB Error');
      });
    });

    describe('findOne', () => {
      testUserProps.forEach((userProps, index) => {
        it(`should return user ${index + 1} with matching email filter`, async () => {
          (mockPrisma.user.findFirst as jest.Mock).mockResolvedValue(testUsersData[index]);

          const result = await userRepository.findOne({ email: userProps.email });

          expect(mockPrisma.user.findFirst).toHaveBeenCalled();
          expect(result).toBeInstanceOf(User);
        });
      });

      it('should return null when no user matches filter', async () => {
        (mockPrisma.user.findFirst as jest.Mock).mockResolvedValue(null);

        const result = await userRepository.findOne({ email: UserEmailVO.create('nonexistent@example.com') });

        expect(result).toBeNull();
      });
    });

    describe('create', () => {
      testUserProps.forEach((userProps, index) => {
        it(`should create user ${index + 1} successfully`, async () => {
          (mockPrisma.user.create as jest.Mock).mockResolvedValue(testUsersData[index]);

          const result = await userRepository.create(userProps);

          expect(mockPrisma.user.create).toHaveBeenCalledWith({
            data: {
              name: userProps.name.fullName(),
              email: userProps.email.email,
              phoneNumber: userProps.phoneNumber.phoneNumber,
              address: userProps.address.fullAddress(),
              isActive: userProps.isActive,
            },
          });
          expect(result).toBeInstanceOf(User);
        });
      });

      it('should handle creation errors', async () => {
        (mockPrisma.user.create as jest.Mock).mockRejectedValue(new Error('Creation failed'));

        await expect(userRepository.create(testUserProps[0])).rejects.toThrow('Creation failed');
      });
    });

    describe('update', () => {
      testUsersData.forEach((userData, index) => {
        it(`should update user ${index + 1} successfully`, async () => {
          // Create a properly formatted updated name that matches what your UserNameVO expects
          const updatedName = `${userData.name} Updated`;
          const updatedUser = { ...userData, name: updatedName };
          (mockPrisma.user.update as jest.Mock).mockResolvedValue(updatedUser);

          // Use the original names to ensure they pass validation
          const updateData = { 
            name: UserNameVO.create(
              testUserProps[index].name.lastName, 
              testUserProps[index].name.firstName, 
              testUserProps[index].name.middleName
            ) 
          };
          
          const result = await userRepository.update(userData.id, updateData);

          expect(mockPrisma.user.update).toHaveBeenCalledWith({
            where: { id: userData.id },
            data: expect.objectContaining({
              name: expect.any(String),
              updatedAt: expect.any(Date),
            }),
          });
          expect(result).toBeInstanceOf(User);
          expect(result.toPrimitives().id).toBe(userData.id);
        });
      });


      it('should handle update errors', async () => {
        (mockPrisma.user.update as jest.Mock).mockRejectedValue(new Error('Update failed'));

        await expect(userRepository.update('user-1', { isActive: false }))
          .rejects.toThrow('Update failed');
      });
    });

    describe('delete', () => {
      testUsersData.forEach((userData, index) => {
        it(`should delete user ${index + 1} successfully`, async () => {
          (mockPrisma.user.delete as jest.Mock).mockResolvedValue(undefined);

          await userRepository.delete(userData.id);

          expect(mockPrisma.user.delete).toHaveBeenCalledWith({
            where: { id: userData.id },
          });
        });
      });

      it('should handle deletion errors', async () => {
        (mockPrisma.user.delete as jest.Mock).mockRejectedValue(new Error('Deletion failed'));

        await expect(userRepository.delete('user-1')).rejects.toThrow('Deletion failed');
      });
    });

    describe('count', () => {
      it('should return correct count for different scenarios', async () => {
        (mockPrisma.user.count as jest.Mock).mockResolvedValue(5);
        let result = await userRepository.count();
        expect(result).toBe(5);

        (mockPrisma.user.count as jest.Mock).mockResolvedValue(3);
        result = await userRepository.count({ isActive: true });
        expect(mockPrisma.user.count).toHaveBeenCalledWith({
          where: expect.objectContaining({ isActive: true }),
        });
        expect(result).toBe(3);

        (mockPrisma.user.count as jest.Mock).mockResolvedValue(1);
        result = await userRepository.count({ isActive: false });
        expect(result).toBe(1);
      });
    });
  });

  // ==================== Custom Method Tests ====================

  describe('Custom Methods', () => {
    describe('findByEmail', () => {
      testUsersData.forEach((userData, index) => {
        it(`should return user ${index + 1} by email`, async () => {
          (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(userData);

          const result = await userRepository.findByEmail(userData.email);

          expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
            where: { email: userData.email },
          });
          expect(result).toBeInstanceOf(User);
        });
      });

      it('should return null for non-existent email', async () => {
        (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null);

        const result = await userRepository.findByEmail('nonexistent@example.com');

        expect(result).toBeNull();
      });
    });

    describe('findByPhone', () => {
      testUsersData.forEach((userData, index) => {
        it(`should return user ${index + 1} by phone number`, async () => {
          (mockPrisma.user.findFirst as jest.Mock).mockResolvedValue(userData);

          const result = await userRepository.findByPhone(userData.phoneNumber);

          expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
            where: {
              phoneNumber: userData.phoneNumber,
            },
          });
          expect(result).toBeInstanceOf(User);
        });
      });

      it('should return null for non-existent phone number', async () => {
        (mockPrisma.user.findFirst as jest.Mock).mockResolvedValue(null);

        const result = await userRepository.findByPhone('+9999999999');

        expect(result).toBeNull();
      });
    });

    describe('findActiveUsers', () => {
      it('should return only active users from multiple data sets', async () => {
        const activeUsers = testUsersData.filter(user => user.isActive && !user.deletedAt);
        (mockPrisma.user.findMany as jest.Mock).mockResolvedValue(activeUsers);

        const result = await userRepository.findActiveUsers();

        expect(result).toHaveLength(3);
        result.forEach((user: User) => {
          expect(user).toBeInstanceOf(User);
          expect(user.isActive).toBe(true);
        });
      });
    });

    describe('deactivateUser', () => {
      testUsersData.forEach((userData, index) => {
        it(`should deactivate user ${index + 1} successfully`, async () => {
          const deactivatedUser = { ...userData, isActive: false };
          (mockPrisma.user.update as jest.Mock).mockResolvedValue(deactivatedUser);

          const result = await userRepository.deactivateUser(userData.id);

          expect(mockPrisma.user.update).toHaveBeenCalledWith({
            where: { id: userData.id },
            data: {
              isActive: false,
              updatedAt: expect.any(Date),
            },
          });
          expect(result).toBeInstanceOf(User);
          expect(result.isActive).toBe(false);
        });
      });
    });

    describe('activateUser', () => {
      testUsersData.forEach((userData, index) => {
        it(`should activate user ${index + 1} successfully`, async () => {
          const activatedUser = { ...userData, isActive: true };
          (mockPrisma.user.update as jest.Mock).mockResolvedValue(activatedUser);

          const result = await userRepository.activateUser(userData.id);

          expect(mockPrisma.user.update).toHaveBeenCalledWith({
            where: { id: userData.id },
            data: {
              isActive: true,
              updatedAt: expect.any(Date),
            },
          });
          expect(result).toBeInstanceOf(User);
          expect(result.isActive).toBe(true);
        });
      });
    });

    describe('softDelete and restore', () => {
      testUsersData.forEach((userData, index) => {
        it(`should soft delete user ${index + 1}`, async () => {
          const softDeletedUser = { ...userData, deletedAt: new Date() };
          (mockPrisma.user.update as jest.Mock).mockResolvedValue(softDeletedUser);

          const result = await userRepository.softDelete(userData.id);

          expect(mockPrisma.user.update).toHaveBeenCalledWith({
            where: { id: userData.id },
            data: {
              deletedAt: expect.any(Date),
              updatedAt: expect.any(Date),
            },
          });
          expect(result).toBeInstanceOf(User);
        });

        it(`should restore user ${index + 1}`, async () => {
          const restoredUser = { ...userData, deletedAt: null };
          (mockPrisma.user.update as jest.Mock).mockResolvedValue(restoredUser);

          const result = await userRepository.restore(userData.id);

          expect(mockPrisma.user.update).toHaveBeenCalledWith({
            where: { id: userData.id },
            data: {
              deletedAt: null,
              updatedAt: expect.any(Date),
            },
          });
          expect(result).toBeInstanceOf(User);
        });
      });
    });
  });

  // ==================== Query and Filter Tests ====================

  describe('Query and Filter Methods', () => {
    describe('findAll with params', () => {
      it('should handle pagination with multiple users', async () => {
        (mockPrisma.user.findMany as jest.Mock).mockResolvedValue(testUsersData.slice(0, 2));

        const params: QueryParams<Partial<UserProps>> = {
          page: 1,
          limit: 2,
        };

        await userRepository.findAll(params);

        expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
          where: expect.any(Object),
          orderBy: undefined,
          skip: 0,
          take: 2,
        });
      });

      it('should handle sorting with different fields', async () => {
        const sortedUsers = [...testUsersData].sort((a, b) => a.name.localeCompare(b.name));
        (mockPrisma.user.findMany as jest.Mock).mockResolvedValue(sortedUsers);

        const params: QueryParams<Partial<UserProps>> = {
          sortBy: 'name',
          sortOrder: 'asc',
        };

        await userRepository.findAll(params);

        expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
          where: expect.any(Object),
          orderBy: { name: 'asc' },
          skip: 0,
          take: 10,
        });
      });

      it('should handle search across multiple users', async () => {
        const searchResults = testUsersData.filter(user => 
          user.name.includes('John') || user.email.includes('john')
        );
        (mockPrisma.user.findMany as jest.Mock).mockResolvedValue(searchResults);

        const params: QueryParams<Partial<UserProps>> = {
          search: 'john',
        };

        await userRepository.findAll(params);

        expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              { name: { contains: 'john', mode: 'insensitive' } },
              { email: { contains: 'john', mode: 'insensitive' } },
            ]),
          }),
          orderBy: undefined,
          skip: 0,
          take: 10,
        });
      });
    });

    describe('findPaginated', () => {
      it('should return paginated result with multiple users', async () => {
        const pageUsers = testUsersData.slice(0, 2);
        (mockPrisma.user.findMany as jest.Mock).mockResolvedValue(pageUsers);
        (mockPrisma.user.count as jest.Mock).mockResolvedValue(5);

        const params: QueryParams<Partial<UserProps>> = {
          page: 1,
          limit: 2,
        };

        const result: PaginatedResult<User> = await userRepository.findPaginated(params);

        expect(result.data).toHaveLength(2);
        expect(result.meta).toEqual({
          totalItems: 5,
          totalPages: 3,
          currentPage: 1,
          pageSize: 2,
        });
      });
    });

    describe('Geographic queries', () => {
      it('should find users by different cities', async () => {
        const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
        
        for (const city of cities) {
          const cityUsers = testUsersData.filter(user => user.address.includes(city));
          (mockPrisma.user.findMany as jest.Mock).mockResolvedValue(cityUsers);

          const result = await userRepository.findByCity(city);

          expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
            where: {
              address: {
                contains: city,
                mode: 'insensitive',
              },
            },
          });
          expect(result).toHaveLength(cityUsers.length);
        }
      });

      it('should find users by country', async () => {
        const usaUsers = testUsersData.filter(user => user.address.includes('USA'));
        (mockPrisma.user.findMany as jest.Mock).mockResolvedValue(usaUsers);

        const result = await userRepository.findByCountry('USA');

        expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
          where: {
            address: {
              contains: 'USA',
              mode: 'insensitive',
            },
          },
        });
        expect(result).toHaveLength(5);
      });
    });

    describe('Date range queries', () => {
      it('should find users created after different dates', async () => {
        const dates = [
          new Date('2023-01-01'),
          new Date('2023-03-01'),
          new Date('2023-05-01')
        ];

        for (const date of dates) {
          const usersAfterDate = testUsersData.filter(user => user.createdAt >= date);
          (mockPrisma.user.findMany as jest.Mock).mockResolvedValue(usersAfterDate);

          const result = await userRepository.findUsersCreatedAfter(date);

          expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
            where: {
              createdAt: {
                gte: date,
              },
            },
          });
          expect(result).toHaveLength(usersAfterDate.length);
        }
      });

      it('should find users created between different date ranges', async () => {
        const dateRanges = [
          { start: new Date('2023-01-01'), end: new Date('2023-03-01') },
          { start: new Date('2023-03-01'), end: new Date('2023-06-01') }
        ];

        for (const range of dateRanges) {
          const usersInRange = testUsersData.filter(user => 
            user.createdAt >= range.start && user.createdAt <= range.end
          );
          (mockPrisma.user.findMany as jest.Mock).mockResolvedValue(usersInRange);

          const result = await userRepository.findUsersCreatedBetween(range.start, range.end);

          expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
            where: {
              createdAt: {
                gte: range.start,
                lte: range.end,
              },
            },
          });
          expect(result).toHaveLength(usersInRange.length);
        }
      });
    });
  });

  // ==================== Domain Conversion Tests ====================

  describe('Domain Conversion', () => {
    describe('toDomain', () => {
      testUsersData.forEach((userData, index) => {
        it(`should convert Prisma record ${index + 1} to User domain entity`, () => {
          const repository = new UserRepository(mockPrisma);
          const result = (repository as any).toDomain(userData);

          expect(result).toBeInstanceOf(User);
          const primitives = result.toPrimitives();
          expect(primitives.id).toBe(userData.id);
          expect(result.name).toBeInstanceOf(UserNameVO);
          expect(result.email).toBeInstanceOf(UserEmailVO);
          expect(result.phoneNumber).toBeInstanceOf(PhoneNumberVO);
          expect(result.address).toBeInstanceOf(AddressVO);
        });
      });

      it('should handle different name parsing scenarios', () => {
        const nameTestCases = [
          { input: 'John Doe', expected: { firstName: 'John', lastName: 'Doe', middleName: undefined } },
          { input: 'Jane Smith', expected: { firstName: 'Jane', lastName: 'Smith', middleName: undefined } },
          { input: 'Bob Michael Johnson', expected: { firstName: 'Bob', lastName: 'Johnson', middleName: 'Michael' } },
          { input: 'Alice Brown', expected: { firstName: 'Alice', lastName: 'Brown', middleName: undefined } },
          { input: 'Charlie Wilson Davis', expected: { firstName: 'Charlie', lastName: 'Davis', middleName: 'Wilson' } }
        ];

        nameTestCases.forEach((testCase) => {
          const repository = new UserRepository(mockPrisma);
          const userWithName = { ...testUsersData[0], name: testCase.input };
          const result = (repository as any).toDomain(userWithName);

          expect(result.name.firstName).toBe(testCase.expected.firstName);
          expect(result.name.lastName).toBe(testCase.expected.lastName);
          expect(result.name.middleName).toBe(testCase.expected.middleName);
        });
      });

      it('should handle different address parsing scenarios', () => {
        const addressTestCases = [
          { input: '123 Main St, New York, NY, 10001, USA', expected: { street: '123 Main St', city: 'New York', state: 'NY', postalCode: '10001', country: 'USA' } },
          { input: '456 Oak Ave, Los Angeles, CA, 90210, USA', expected: { street: '456 Oak Ave', city: 'Los Angeles', state: 'CA', postalCode: '90210', country: 'USA' } },
          { input: '789 Pine Rd, Chicago, IL, 60601, USA', expected: { street: '789 Pine Rd', city: 'Chicago', state: 'IL', postalCode: '60601', country: 'USA' } }
        ];

        addressTestCases.forEach((testCase) => {
          const repository = new UserRepository(mockPrisma);
          const userWithAddress = { ...testUsersData[0], address: testCase.input };
          const result = (repository as any).toDomain(userWithAddress);

          expect(result.address.street).toBe(testCase.expected.street);
          expect(result.address.city).toBe(testCase.expected.city);
          expect(result.address.state).toBe(testCase.expected.state);
          expect(result.address.postalCode).toBe(testCase.expected.postalCode);
          expect(result.address.country).toBe(testCase.expected.country);
        });
      });

      it('should throw error on invalid data for different scenarios', () => {
        const invalidTestCases = [
          { ...testUsersData[0], email: 'invalid-email' },
          { ...testUsersData[1], phoneNumber: '' },
          { ...testUsersData[2], name: '' }
        ];

        invalidTestCases.forEach((invalidUser) => {
          const repository = new UserRepository(mockPrisma);
          expect(() => (repository as any).toDomain(invalidUser)).toThrow();
        });
      });
    });

    describe('toPrismaFilter', () => {
      testUserProps.forEach((userProps, index) => {
        it(`should convert domain filter ${index + 1} to Prisma where clause`, () => {
          const repository = new UserRepository(mockPrisma);
          const filter = {
            email: userProps.email,
            phoneNumber: userProps.phoneNumber,
            isActive: userProps.isActive,
          };

          const result = (repository as any).toPrismaFilter(filter);

          const expectedResult: any = {
            email: userProps.email.email,
            phoneNumber: userProps.phoneNumber.phoneNumber,
            isActive: userProps.isActive,
          };

          expect(result).toEqual(expectedResult);
        });
      });

      it('should handle different partial filter scenarios', () => {
        const partialFilters = [
          { email: testUserProps[0].email },
          { phoneNumber: testUserProps[1].phoneNumber },
          { isActive: testUserProps[2].isActive },
          { email: testUserProps[3].email, isActive: testUserProps[3].isActive }
        ];

        partialFilters.forEach((filter) => {
          const repository = new UserRepository(mockPrisma);
          const result = (repository as any).toPrismaFilter(filter);
          
          if (filter.email) expect(result.email).toBe(filter.email.email);
          if (filter.phoneNumber) expect(result.phoneNumber).toBe(filter.phoneNumber.phoneNumber);
          if (filter.isActive !== undefined) expect(result.isActive).toBe(filter.isActive);
        });
      });
    });

    describe('toPrismaCreate and toPrismaUpdate', () => {
      testUserProps.forEach((userProps, index) => {
        it(`should convert domain data ${index + 1} for creation`, () => {
          const repository = new UserRepository(mockPrisma);
          const result = (repository as any).toPrismaCreate(userProps);

          expect(result).toEqual({
            name: userProps.name.fullName(),
            email: userProps.email.email,
            phoneNumber: userProps.phoneNumber.phoneNumber,
            address: userProps.address.fullAddress(),
            isActive: userProps.isActive,
          });
        });

        it(`should convert domain data ${index + 1} for update with timestamp`, () => {
          const repository = new UserRepository(mockPrisma);
          const result = (repository as any).toPrismaUpdate(userProps);

          expect(result).toEqual({
            name: userProps.name.fullName(),
            email: userProps.email.email,
            phoneNumber: userProps.phoneNumber.phoneNumber,
            address: userProps.address.fullAddress(),
            isActive: userProps.isActive,
            updatedAt: expect.any(Date),
          });
        });
      });
    });
  });

  // ==================== Edge Cases and Error Handling ====================

  describe('Edge Cases and Error Handling', () => {
    it('should handle different empty search result scenarios', async () => {
      const emptyScenarios = [
        { search: 'nonexistent' },
        { filters: { email: UserEmailVO.create('notfound@example.com') } },
        { page: 100, limit: 10 }
      ];

      for (const scenario of emptyScenarios) {
        (mockPrisma.user.findMany as jest.Mock).mockResolvedValue([]);
        const result = await userRepository.findAll(scenario);
        expect(result).toEqual([]);
      }
    });

    it('should handle different null values in filters', async () => {
      const nullFilterScenarios = [
        { isActive: null },
        { email: null },
        { phoneNumber: null }
      ];

      for (const filters of nullFilterScenarios) {
        (mockPrisma.user.findMany as jest.Mock).mockResolvedValue([]);
        await userRepository.findAll({ filters: filters as any });
        expect(mockPrisma.user.findMany).toHaveBeenCalled();
      }
    });

    it('should handle soft-deleted users exclusion with different data sets', async () => {
      const mixedUsers = testUsersData;
      (mockPrisma.user.findMany as jest.Mock).mockResolvedValue(
        mixedUsers.filter(user => !user.deletedAt)
      );

      await userRepository.findAll();

      expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
        where: {
          deletedAt: null,
        },
        orderBy: undefined,
        skip: 0,
        take: 10,
      });
    });

    it('should handle different database connection errors', async () => {
      const errorScenarios = [
        new Error('Connection timeout'),
        new Error('Database not reachable'),
        new Error('Query execution failed')
      ];

      for (const error of errorScenarios) {
        (mockPrisma.user.findMany as jest.Mock).mockRejectedValue(error);
        await expect(userRepository.findAll()).rejects.toThrow(error.message);
      }
    });

    it('should handle bulk operations with multiple users', async () => {
      for (let i = 0; i < testUserProps.length; i++) {
        (mockPrisma.user.create as jest.Mock).mockResolvedValue(testUsersData[i]);
        const result = await userRepository.create(testUserProps[i]);
        expect(result).toBeInstanceOf(User);
      }
      expect(mockPrisma.user.create).toHaveBeenCalledTimes(testUserProps.length);

      for (let i = 0; i < testUsersData.length; i++) {
        (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(testUsersData[i]);
        const result = await userRepository.findByEmail(testUsersData[i].email);
        expect(result).toBeInstanceOf(User);
      }
    });
  });
});