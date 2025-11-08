// src/tests/unit/user/mappers/User.mapper.spec.ts
import { UserMapper } from '../../../../modules/user/mappers/User.mapper';
import { CreateUserDTO } from '../../../../modules/user/dto/CreateUser.dto';
import { UpdateUserDTO } from '../../../../modules/user/dto/UpdateUser.dto';
import { User } from '../../../../modules/user/domain/User.entity';
import { UserNameVO } from '../../../../modules/user/domain/value-objects/UserName.vo';
import { AddressVO } from '../../../../modules/user/domain/value-objects/Address.vo';
import { PaginatedResult } from '../../../../core/types/Pagination.type';

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

/* -------------------------------------------------------------------------- */
/*                               10 User Seeds                               */
/* -------------------------------------------------------------------------- */
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

/* -------------------------------------------------------------------------- */
/*                               DTO Factory                                 */
/* -------------------------------------------------------------------------- */
const createDTO = (seed: UserSeed) =>
  CreateUserDTO.create({
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

/* -------------------------------------------------------------------------- */
/*                         User Builder (type-safe)                         */
/* -------------------------------------------------------------------------- */
const buildUser = (overrides?: {
  name?: UserNameVO;
  address?: AddressVO;
  deletedAt?: Date | null;
}): User => {
  const baseProps = UserMapper.toDomainProps(createDTO(USER_SEEDS[0]));
  const user = User.create(baseProps);

  // Set audit fields safely (only place we use `any`)
  (user as any).id = 'user-123';
  (user as any).createdAt = new Date('2025-01-01T00:00:00Z');
  (user as any).updatedAt = new Date('2025-01-02T00:00:00Z');
  (user as any).deletedAt = null;

  if (overrides?.name || overrides?.address || overrides?.deletedAt !== undefined) {
    const newProps = {
      ...baseProps,
      name: overrides.name ?? baseProps.name,
      address: overrides.address ?? baseProps.address,
    };
    const fresh = User.create(newProps);
    (fresh as any).id = (user as any).id;
    (fresh as any).createdAt = (user as any).createdAt;
    (fresh as any).updatedAt = (user as any).updatedAt;
    (fresh as any).deletedAt = overrides.deletedAt ?? null;
    return fresh;
  }

  if (overrides?.deletedAt !== undefined) {
    (user as any).deletedAt = overrides.deletedAt;
  }
  return user;
};

/* -------------------------------------------------------------------------- */
/*                                 Tests                                      */
/* -------------------------------------------------------------------------- */
describe('UserMapper', () => {
  /* ---------------------------------------------------- toDomainProps ---------------------------------------------------- */
  describe('toDomainProps', () => {
    USER_SEEDS.forEach((seed, idx) => {
      it(`maps all fields correctly (seed #${idx + 1})`, () => {
        const dto = createDTO(seed);
        const props = UserMapper.toDomainProps(dto);

        expect(props.name.firstName).toBe(seed.firstName ?? undefined);
        expect(props.name.middleName).toBe(seed.middleName ?? undefined);
        expect(props.name.lastName).toBe(seed.lastName);
        expect(props.name.fullName()).toBe(
          [seed.firstName, seed.middleName, seed.lastName].filter(Boolean).join(' ')
        );

        expect(props.email.email).toBe(seed.email);
        expect(props.phoneNumber.phoneNumber).toBe(seed.phoneNumber);

        expect(props.address.street).toBe(seed.street);
        expect(props.address.city).toBe(seed.city);
        expect(props.address.state).toBe(seed.state ?? undefined);
        expect(props.address.postalCode).toBe(seed.postalCode ?? undefined);
        expect(props.address.country).toBe(seed.country);
        expect(props.isActive).toBe(true);
      });
    });

    it('handles null to undefined for optional fields', () => {
      const dto = createDTO({
        ...USER_SEEDS[0],
        firstName: null,
        middleName: null,
        state: null,
        postalCode: null,
      });
      const props = UserMapper.toDomainProps(dto);

      expect(props.name.firstName).toBeUndefined();
      expect(props.name.middleName).toBeUndefined();
      expect(props.address.state).toBeUndefined();
      expect(props.address.postalCode).toBeUndefined();
    });

    it('handles missing optional fields (undefined)', () => {
      const dto = createDTO({
        ...USER_SEEDS[0],
        firstName: undefined,
        middleName: undefined,
        state: undefined,
        postalCode: undefined,
      });
      const props = UserMapper.toDomainProps(dto);

      expect(props.name.firstName).toBeUndefined();
      expect(props.name.middleName).toBeUndefined();
      expect(props.address.state).toBeUndefined();
      expect(props.address.postalCode).toBeUndefined();
    });
  });

  /* ---------------------------------------------------- toUpdateProps ---------------------------------------------------- */
  describe('toUpdateProps', () => {
    it('updates only provided fields', () => {
      const dto = UpdateUserDTO.create({ email: 'new@domain.com' });
      const props = UserMapper.toUpdateProps(dto);
      expect(Object.keys(props)).toEqual(['email']);
      expect(props.email?.email).toBe('new@domain.com');
    });

    it('re-creates name VO only when lastName is provided', () => {
      const dto = UpdateUserDTO.create({ lastName: 'NewLast', firstName: 'NewFirst' });
      const props = UserMapper.toUpdateProps(dto);
      expect(props.name?.firstName).toBe('NewFirst');
      expect(props.name?.lastName).toBe('NewLast');
    });

    it('converts null to undefined for name fields', () => {
      const dto = UpdateUserDTO.create({ lastName: 'Keep', firstName: null });
      const props = UserMapper.toUpdateProps(dto);
      expect(props.name?.firstName).toBeUndefined();
      expect(props.name?.lastName).toBe('Keep');
    });

    it('updates address only when required fields are present', () => {
      const dto = UpdateUserDTO.create({
        street: 'New St',
        city: 'New City',
        country: 'New Country',
      });
      const props = UserMapper.toUpdateProps(dto);
      expect(props.address?.street).toBe('New St');
      expect(props.address?.city).toBe('New City');
      expect(props.address?.country).toBe('New Country');
    });

    it('converts null to undefined for address fields', () => {
      const dto = UpdateUserDTO.create({ state: null, postalCode: null });
      const props = UserMapper.toUpdateProps(dto);
      expect(props.address?.state).toBeUndefined();
      expect(props.address?.postalCode).toBeUndefined();
    });

    it('updates isActive flag', () => {
      const dto = UpdateUserDTO.create({ isActive: false });
      const props = UserMapper.toUpdateProps(dto);
      expect(props.isActive).toBe(false);
    });

    it('returns empty object when no valid fields are provided', () => {
      const dto = UpdateUserDTO.create({ firstName: 'Only' });
      const props = UserMapper.toUpdateProps(dto);
      expect(props).toEqual({});
    });

    it('handles all fields at once', () => {
      const dto = UpdateUserDTO.create({
        lastName: 'Smith',
        firstName: 'Jane',
        middleName: null,
        email: 'jane@smith.com',
        phoneNumber: '+1987654321',
        street: '456 Ave',
        city: 'LA',
        state: 'CA',
        postalCode: '90210',
        country: 'USA',
        isActive: false,
      });
      const props = UserMapper.toUpdateProps(dto);

      expect(props.name?.firstName).toBe('Jane');
      expect(props.name?.middleName).toBeUndefined();
      expect(props.name?.lastName).toBe('Smith');
      expect(props.email?.email).toBe('jane@smith.com');
      expect(props.phoneNumber?.phoneNumber).toBe('+1987654321');
      expect(props.address?.city).toBe('LA');
      expect(props.address?.state).toBe('CA');
      expect(props.isActive).toBe(false);
    });
  });

  /* ---------------------------------------------------- toResponseDTO ---------------------------------------------------- */
  describe('toResponseDTO', () => {
    USER_SEEDS.forEach((seed, idx) => {
      it(`maps full user correctly (seed #${idx + 1})`, () => {
        const dto = createDTO(seed);
        const props = UserMapper.toDomainProps(dto);
        const user = User.create(props);
        (user as any).id = `user-${idx + 1}`;
        (user as any).createdAt = new Date('2025-01-01T00:00:00Z');
        (user as any).updatedAt = new Date('2025-01-02T00:00:00Z');
        (user as any).deletedAt = null;

        const response = UserMapper.toResponseDTO(user);

        expect(response.id).toBe(`user-${idx + 1}`);
        expect(response.firstName).toBe(seed.firstName ?? null);
        expect(response.middleName).toBe(seed.middleName ?? null);
        expect(response.lastName).toBe(seed.lastName);
        expect(response.email).toBe(seed.email);
        expect(response.phoneNumber).toBe(seed.phoneNumber);
        expect(response.street).toBe(seed.street);
        expect(response.city).toBe(seed.city);
        expect(response.state).toBe(seed.state ?? null);
        expect(response.postalCode).toBe(seed.postalCode ?? null);
        expect(response.country).toBe(seed.country);
        expect(response.isActive).toBe(true);
        expect(response.createdAt).toEqual(new Date('2025-01-01T00:00:00Z'));
        expect(response.updatedAt).toEqual(new Date('2025-01-02T00:00:00Z'));
        expect(response.deleteAt).toBe(null);
      });
    });

    it('returns null for missing optional fields', () => {
      const name = UserNameVO.create('Doe', undefined, undefined);
      const address = AddressVO.create('123 St', 'NYC', 'USA', undefined, undefined);
      const user = buildUser({ name, address });

      const dto = UserMapper.toResponseDTO(user);

      expect(dto.firstName).toBe(null);
      expect(dto.middleName).toBe(null);
      expect(dto.state).toBe(null);
      expect(dto.postalCode).toBe(null);
    });

    it('includes deleteAt when soft-deleted', () => {
      const deletedAt = new Date('2025-01-03T00:00:00Z');
      const user = buildUser({ deletedAt });
      const dto = UserMapper.toResponseDTO(user);
      expect(dto.deleteAt).toEqual(deletedAt);
    });
  });

  /* ---------------------------------------------------- toPaginatedResponseDTO ---------------------------------------------------- */
  describe('toPaginatedResponseDTO', () => {
    it('maps paginated result with 10 users', () => {
      const users: User[] = USER_SEEDS.map((seed, i) => {
        const dto = createDTO(seed);
        const props = UserMapper.toDomainProps(dto);
        const u = User.create(props);
        (u as any).id = `user-${i + 1}`;
        (u as any).createdAt = new Date('2025-01-01T00:00:00Z');
        (u as any).updatedAt = new Date('2025-01-02T00:00:00Z');
        (u as any).deletedAt = null;
        return u;
      });

      const paginated: PaginatedResult<User> = {
        data: users,
        meta: {
          totalItems: 57,
          totalPages: 6,
          currentPage: 3,
          pageSize: 10,
        },
      };

      const result = UserMapper.toPaginatedResponseDTO(paginated);

      expect(result.data).toHaveLength(10);
      result.data.forEach((dto, i) => {
        expect(dto.id).toBe(`user-${i + 1}`);
        expect(dto.email).toBe(USER_SEEDS[i].email);
      });
      expect(result.meta.totalItems).toBe(57);
      expect(result.meta.totalPages).toBe(6);
      expect(result.meta.currentPage).toBe(3);
      expect(result.meta.pageSize).toBe(10);
    });

    it('handles empty data array', () => {
      const paginated: PaginatedResult<User> = {
        data: [],
        meta: { totalItems: 0, totalPages: 0, currentPage: 1, pageSize: 10 },
      };

      const result = UserMapper.toPaginatedResponseDTO(paginated);
      expect(result.data).toEqual([]);
      expect(result.meta.totalItems).toBe(0);
    });
  });
});