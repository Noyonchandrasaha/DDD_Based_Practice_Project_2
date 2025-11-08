// ============================================================
// FILE: src/modules/user/domain/value-objects/Address.vo.ts
// ============================================================

import { ValueObject } from '@core/domain/value-objects/ValueObject';

export interface AddressProps {
  street: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
}

export class AddressVO extends ValueObject<AddressProps> {
  private constructor(props: AddressProps) {
    super(props);
    Object.freeze(this); // Double-freeze: props + instance
  }

  get street(): string {
    return this.props.street;
  }

  get city(): string {
    return this.props.city;
  }

  get state(): string | undefined {
    return this.props.state;
  }

  get postalCode(): string | undefined {
    return this.props.postalCode;
  }

  get country(): string {
    return this.props.country;
  }

  /** Returns a formatted full address string */
  fullAddress(): string {
    return [this.street, this.city, this.state, this.postalCode, this.country]
      .filter(Boolean)
      .join(', ');
  }

  private static validate(props: AddressProps): void {
    if (!props.street) {
      throw new Error('Street cannot be empty');
    }
    if (!props.city) {
      throw new Error('City cannot be empty');
    }
    if (!props.country) {
      throw new Error('Country cannot be empty');
    }
  }

  public static create(
    street: string,
    city: string,
    country: string,
    state?: string,
    postalCode?: string
  ): AddressVO {
    const props: AddressProps = {
      street: street?.trim() || '',
      city: city?.trim() || '',
      country: country?.trim() || '',
      state: state?.trim(),
      postalCode: postalCode?.trim(),
    };

    this.validate(props);
    return new AddressVO(props);
  }
}