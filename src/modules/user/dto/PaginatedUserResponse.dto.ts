// ============================================================
// FILE: src/modules/user/dto/PaginatedUserResponse.dto.ts
// ============================================================

import { UserResponseDTO } from './UserResponse.dto';

export class PaginatedUserResponseDTO {
    private constructor(
        public readonly data: UserResponseDTO[],
        public readonly meta: {
            totalItems: number,
            totalPages: number,
            currentPage: number,
            pageSize: number
        }
    ) {}

    public static create (
        data: UserResponseDTO[],
        totalItems: number,
        totalPages: number,
        currentPage: number,
        pageSize: number
    ): PaginatedUserResponseDTO {
        return new PaginatedUserResponseDTO(
            data,
            {
                totalItems,
                totalPages,
                currentPage,
                pageSize
            }
        )
    }
}