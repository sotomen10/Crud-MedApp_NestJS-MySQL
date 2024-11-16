import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {  ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModuleCustom } from './config/config.module';
import { UsersModule } from './modules/users/users.module';
import { join } from 'path';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/general-exceptions.filter';
import { AuthModule } from './auth/auth.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { PatientsModule } from './modules/patients/patients.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
  ConfigModuleCustom,
  TypeOrmModule.forRoot({ 
    type:'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.PASSWORD,
    database: process.env.DB_NAME,
    entities: [join(__dirname + '/**/*.entity{.ts,.js}')],
    synchronize: true,}),
  UsersModule,
  AuthModule,
  AppointmentsModule,
  PatientsModule,
  NotificationsModule,
  
],
  controllers: [AppController],
  providers: [AppService,
    ConfigService,
    {
      provide:APP_FILTER,
      useClass:AllExceptionsFilter
    }
  
  ],
})
export class AppModule {}
