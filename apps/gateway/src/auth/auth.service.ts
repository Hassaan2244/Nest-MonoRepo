import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from 'common/dtos/create-user.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(@Inject('AUTH_SERVICE') private readonly client: ClientProxy) {}

  async registerUser(dto: CreateUserDto) {
    return await firstValueFrom(this.client.send('register_user', dto));
  }

  async loginUser(email: string, password: string) {
    return await firstValueFrom(this.client.send('login_user', { email, password }));
  }

  async getAllUsers() {
    return await firstValueFrom(this.client.send('get_users', {}));
  }
}
