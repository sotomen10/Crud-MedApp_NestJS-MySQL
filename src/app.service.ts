import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class AppService {
  getHello(): string {
    // Lee el archivo HTML y lo retorna
    return readFileSync(join(__dirname, '..', 'welcome.html'), 'utf8');
  }
}

