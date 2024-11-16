import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class AppService {
  getHello(): string {
    
    return readFileSync(join(__dirname, '..', 'welcome.html'), 'utf8');// Reads the HTML file and returns it
  }
}

