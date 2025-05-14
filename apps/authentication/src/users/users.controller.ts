import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto } from 'common/dtos/create-user.dto';
import { AppLogger } from 'core/logger/logger.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService, private readonly logger: AppLogger) {}

  @MessagePattern('register_user')
  registerUser(data: CreateUserDto) {
    this.logger.log(`Received register_user TCP message`);
    return this.usersService.register(data);

  }

  @MessagePattern('get_users')
  getUsers() {
    this.logger.log(`Received get_users TCP message`);
    return this.usersService.findAll();
  }

 @MessagePattern('login_user')
async login(data: { email: string; password: string }) {
    this.logger.log(`Received login_user TCP message for: ${data.email}`);
  const user = await this.usersService.validateUser(data.email, data.password);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const token = await this.usersService.generateToken(user);

  return {
    token: token.access_token,
    user: {
      name: user.name,
      email: user.email
    }
  };
}
}
