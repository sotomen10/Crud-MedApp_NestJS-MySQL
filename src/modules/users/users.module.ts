import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from 'src/auth/entities/roles.entity';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';

@Module({
  imports:[TypeOrmModule.forFeature([User,Role])],
  controllers: [UsersController],
  providers: [UsersService,NotificationsGateway],
})
export class UsersModule {}
