// ============================================================
// FILE: src/modules/user/service/User.service.ts
// ============================================================

import { CreateUserUseCase } from '../application/use-cases/CreateUser.usecase';
import { UserRepository } from '../repository/User.repository';
import { UserMapper } from '../mappers/User.mapper';
import { UserResponseDTO } from '../dto/UserResponse.dto';
import { CreateUserCommand } from '../application/commands/CreateUser.command';
import { ValidationException } from '../../../common/exceptions/ValidationException';
import { ConflictException } from '../../../common/exceptions/ConflictException';

export class UserService {
  private readonly useCase: CreateUserUseCase;

  constructor(private readonly userRepository: UserRepository) {
    this.useCase = new CreateUserUseCase(this.userRepository);
  }

  public async createUser(command: CreateUserCommand): Promise<UserResponseDTO> {
    try {
      console.log('Received CreateUserCommand:', command);

      // ✅ Check for duplicate email
      const existingUser = await this.userRepository.findByEmail(command.email);
      if (existingUser) {
        throw new ConflictException('User with this email already exists', {
          email: command.email
        });
      }

      // ✅ Execute use case (includes domain validation)
      const userEntity = await this.useCase.execute(command);
      
      // ✅ Convert to DTO
      return UserMapper.toResponseDTO(userEntity);
      
    } catch (error: any) {
      console.error('❌ UserService.createUser Error:', error);
      
      // Handle known errors
      if (
        error instanceof ValidationException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      // Wrap domain validation errors
      if (error.message?.includes('cannot be empty')) {
        throw new ValidationException('Domain validation failed', {
          field: this.extractFieldFromError(error.message),
          message: error.message
        });
      }

      // Wrap unknown errors
      throw new ValidationException('Failed to create user', {
        reason: error.message || 'Unknown error'
      });
    }
  }

  private extractFieldFromError(message: string): string {
    const match = message.match(/^(\w+)\s+cannot be empty/i);
    return match ? match[1].toLowerCase() : 'unknown';
  }
}
