// ============================================================
// FILE: src/modules/user/domain/value-objects/Address.vo.ts
// ============================================================

import { AddressVO } from '../../../../../modules/user/domain/value-objects/Address.vo';


describe('AddressVO', () => {
  // === VALID ADDRESSES ===
  it('should create minimal valid address (street, city, country)', () => {
    const address = AddressVO.create('123 Main St', 'New York', 'USA');
    expect(address.street).toBe('123 Main St');
    expect(address.city).toBe('New York');
    expect(address.country).toBe('USA');
    expect(address.state).toBeUndefined();
    expect(address.postalCode).toBeUndefined();
  });

  it('should create full address with state and postal code', () => {
    const address = AddressVO.create('456 Elm Ave', 'Los Angeles', 'USA', 'CA', '90210');
    expect(address.state).toBe('CA');
    expect(address.postalCode).toBe('90210');
  });

  it('should trim whitespace from all fields', () => {
    const address = AddressVO.create('  789 Oak Dr  ', '  Chicago  ', '  Canada  ', ' ON ', ' M5V 2T6 ');
    expect(address.street).toBe('789 Oak Dr');
    expect(address.city).toBe('Chicago');
    expect(address.country).toBe('Canada');
    expect(address.state).toBe('ON');
    expect(address.postalCode).toBe('M5V 2T6');
  });

  // === FULL ADDRESS FORMATTING ===
  it('should format fullAddress correctly (all fields)', () => {
    const address = AddressVO.create('1 Infinite Loop', 'Cupertino', 'USA', 'CA', '95014');
    expect(address.fullAddress()).toBe('1 Infinite Loop, Cupertino, CA, 95014, USA');
  });

  it('should format fullAddress correctly (missing optional fields)', () => {
    const address = AddressVO.create('10 Downing St', 'London', 'UK');
    expect(address.fullAddress()).toBe('10 Downing St, London, UK');
  });

  it('should format fullAddress correctly (only state)', () => {
    const address = AddressVO.create('1600 Pennsylvania Ave', 'Washington', 'USA', 'DC');
    expect(address.fullAddress()).toBe('1600 Pennsylvania Ave, Washington, DC, USA');
  });

  it('should format fullAddress correctly (only postal code)', () => {
    const address = AddressVO.create('350 5th Ave', 'New York', 'USA', undefined, '10118');
    expect(address.fullAddress()).toBe('350 5th Ave, New York, 10118, USA');
  });

  // === REQUIRED FIELD VALIDATION ===
  it('should throw if street is empty', () => {
    expect(() => AddressVO.create('', 'New York', 'USA')).toThrow('Street cannot be empty');
  });

  it('should throw if street is null or undefined', () => {
    // @ts-ignore
    expect(() => AddressVO.create(null, 'New York', 'USA')).toThrow('Street cannot be empty');
    // @ts-ignore
    expect(() => AddressVO.create(undefined, 'New York', 'USA')).toThrow('Street cannot be empty');
  });

  it('should throw if city is empty', () => {
    expect(() => AddressVO.create('123 Main St', '', 'USA')).toThrow('City Cannot be empty');
  });

  it('should throw if city is null or undefined', () => {
    // @ts-ignore
    expect(() => AddressVO.create('123 Main St', null, 'USA')).toThrow('City Cannot be empty');
    // @ts-ignore
    expect(() => AddressVO.create('123 Main St', undefined, 'USA')).toThrow('City Cannot be empty');
  });

  it('should throw if country is empty', () => {
    expect(() => AddressVO.create('123 Main St', 'New York', '')).toThrow('Country cannot be empty');
  });

  it('should throw if country is null or undefined', () => {
    // @ts-ignore
    expect(() => AddressVO.create('123 Main St', 'New York', null)).toThrow('Country cannot be empty');
    // @ts-ignore
    expect(() => AddressVO.create('123 Main St', 'New York', undefined)).toThrow('Country cannot be empty');
  });

  // === OPTIONAL FIELDS ===
  it('should allow state to be undefined', () => {
    const address = AddressVO.create('123 Main St', 'New York', 'USA');
    expect(address.state).toBeUndefined();
  });

  it('should allow postalCode to be undefined', () => {
    const address = AddressVO.create('123 Main St', 'New York', 'USA');
    expect(address.postalCode).toBeUndefined();
  });

  // === EDGE CASES ===
  it('should handle special characters in fields', () => {
    const address = AddressVO.create('São Paulo St. #5', 'Québec', 'Canada', 'QC', 'H3Z 2Y7');
    expect(address.street).toBe('São Paulo St. #5');
    expect(address.city).toBe('Québec');
    expect(address.fullAddress()).toBe('São Paulo St. #5, Québec, QC, H3Z 2Y7, Canada');
  });

  it('should handle very long addresses', () => {
    const longStreet = 'A'.repeat(200);
    const address = AddressVO.create(longStreet, 'Metropolis', 'Universe');
    expect(address.street).toBe(longStreet);
  });

  // === IMMUTABILITY ===
  it('should not allow mutation of props', () => {
    const address = AddressVO.create('123 Main St', 'New York', 'USA');
    // @ts-ignore
    expect(() => { address.props.street = 'Hack'; }).toThrow(TypeError);
    // @ts-ignore
    expect(() => { address.props = {}; }).toThrow(TypeError);
  });

  // === FULLADDRESS FILTERS EMPTY STRINGS ===
  it('should exclude empty optional fields from fullAddress', () => {
    const address = AddressVO.create('123 Main St', 'New York', 'USA', '', '');
    expect(address.fullAddress()).toBe('123 Main St, New York, USA');
  });
});