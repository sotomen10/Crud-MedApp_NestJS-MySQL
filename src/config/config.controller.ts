import { Controller } from '@nestjs/common';
import { ConfigService } from './config.service';

@Controller()
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}
}
