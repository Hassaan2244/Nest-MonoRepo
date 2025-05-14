import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'common/dtos/create-user.dto';
import { User, UserDocument } from './users.schema';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AppLogger } from 'core/logger/logger.service';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private readonly logger: AppLogger,
  ) {}

  async register(dto: CreateUserDto): Promise<User> {
  try {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = new this.userModel({ ...dto, password: hashedPassword });
    return await user.save();
  } catch (err) {
    if (err.code === 11000) {
      throw new RpcException('Email already exists');
    }
    throw new RpcException('Registration failed');
  }
}


  async findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }

  
async validateUser(email: string, password: string): Promise<User | null> {
  this.logger.log(`Validating user credentials for: ${email}`);
  const user = await this.findByEmail(email);
  const isValid = user && await bcrypt.compare(password, user.password);
  if (!isValid) this.logger.warn(`Login failed for: ${email}`);
  return isValid ? user : null;
}

async generateToken(user: User): Promise<{ access_token: string }> {
  const payload = { email: user.email};
  const token = this.jwtService.sign(payload);
  this.logger.log(`Generated JWT for user: ${user.email}`);
  return { access_token: token };
  }
}
