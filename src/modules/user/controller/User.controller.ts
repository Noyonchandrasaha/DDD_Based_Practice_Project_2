// ============================================================
// FILE: src/modules/user/controller/User.controller.ts
// ============================================================
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../service/User.service';
import { CreateUserCommand } from '../application/commands/CreateUser.command';
import { ResponseHandler } from '../../../common/utils/ResponseHandler.util';
import { HttpStatus } from '../../../core/enums/HttpStatus.enum';

export class UserController {
  private readonly userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  // ✅ FIX: Remove CatchAsync wrapper and handle properly
  public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log("Received request in createUser controller:", req.body);

      // ✅ FIX: Data is already validated by middleware, just create command
      const createUserCommand = CreateUserCommand.fromValidatedData(req.body);
      console.log("CreateUserCommand created:", createUserCommand);

      const userResponse = await this.userService.createUser(createUserCommand);
      console.log("User response from service:", userResponse);

      // ✅ FIX: Use ResponseHandler properly
      ResponseHandler.success(
        res,
        userResponse,
        'User Created Successfully',
        HttpStatus.CREATED
      );
    } catch (error) {
      // ✅ FIX: Pass error to error handling middleware
      next(error);
    }
  };
}