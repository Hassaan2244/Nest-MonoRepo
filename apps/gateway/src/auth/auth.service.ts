import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from 'common/dtos/create-user.dto';
import { firstValueFrom } from 'rxjs';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(@Inject('AUTH_SERVICE') private readonly client: ClientProxy) {}

 async registerUser(dto: CreateUserDto) {
  try {
    return await firstValueFrom(this.client.send('register_user', dto));
  } catch (error) {
    throw new BadRequestException(error.message || 'Registration failed');
  }
}

async loginUser(email: string, password: string) {
  try {
    return await firstValueFrom(this.client.send('login_user', { email, password }));
  } catch (error) {
    throw new BadRequestException(error.message || 'Login failed');
  }
}

  async getAllUsers() {
    return await firstValueFrom(this.client.send('get_users', {}));
  }
}
