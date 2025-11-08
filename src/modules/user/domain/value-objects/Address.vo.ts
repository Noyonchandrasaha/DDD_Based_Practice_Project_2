// ============================================================
// FILE: src/modules/user/domain/value-objects/Address.vo.ts
// ============================================================

import { ValueObject } from '../../../../core/domain/value-objects/ValueObject';

export interface AddressProps {
    street: string;
    city: string;
    state?: string;
    postalCode?: string;
    country: string;
}

export class AddressVO extends ValueObject<AddressProps> {
    private constructor (props: AddressProps) {
        super(props);
        Object.freeze(this);
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

    fullAddress(): string {
        return [this.street, this.city, this.state, this.postalCode, this.country].filter(Boolean).join(', ');
    }

    private static validate(props: AddressProps): void {
        // Validate street
        if (props.street == null || props.street === '') {
            throw new Error('Street cannot be empty');
        }

        // Validate city
        if (props.city == null || props.city === '') {
            throw new Error('City cannot be empty');
        }

        // Validate country - updated to handle trimming empty strings
        if (!props.country || props.country.trim() === '') {
            throw new Error('Country cannot be empty');
        }
    }

    // Factory method to create AddressVO
    public static create(street: string, city: string, country: string, state?: string, postalCode?: string): AddressVO {
        // Trim the inputs
        const s = street?.trim() ?? '';
        const c = city?.trim() ?? '';
        const co = country?.trim() ?? '';  // If country is empty, it'll become ''

        // Prepare the props
        const props: AddressProps = {
            street: s,
            city: c,
            state: state?.trim(),
            postalCode: postalCode?.trim(),
            country: co,
        };

        // Log the country value before validation for debugging
        console.log('Country before validation:', co);

        // Perform validation
        this.validate(props);

        // Return new AddressVO instance
        return new AddressVO(props);
    }
}
