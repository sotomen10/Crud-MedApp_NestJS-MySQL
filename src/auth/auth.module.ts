import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Role } from './entities/roles.entity';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/users.service';
import { ConfigModuleCustom } from 'src/config/config.module';
import { JwtStrategyRols } from './strategy/rols.strategy';
import { GoogleStrategy } from './strategy/google.strategy';

@Module({
  imports:[TypeOrmModule.forFeature([User,Role]),
JwtModule.register({  
  global:true,
  secret:process.env.JWT_SECRET_APPI,
  signOptions:{expiresIn:process.env.EXPIRESIN}
})
],
  controllers: [AuthController],
  providers: [AuthService,UsersService,JwtStrategyRols,GoogleStrategy],
})
export class AuthModule {}
