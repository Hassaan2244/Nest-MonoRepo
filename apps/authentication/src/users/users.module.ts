import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';
import { LoggerModule } from 'core/logger/logger.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: 'super-secret-key', // match your strategy
      signOptions: { expiresIn: '1h' },
    }),
    LoggerModule
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
