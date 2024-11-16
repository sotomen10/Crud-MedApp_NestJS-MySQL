import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { ConfigController } from './config.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports:[ConfigModule.forRoot({
    isGlobal:true,
    envFilePath:[".env"],
    load:[]
  })],
  controllers: [ConfigController],
  providers: [ConfigService],
})
export class ConfigModuleCustom {}
