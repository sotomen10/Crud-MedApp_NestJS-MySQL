import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UpdateUserPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    
    if (metatype !== UpdateUserDto) {
      return value;
    }

    
    const object = plainToInstance(metatype, value);

   
    const hasValidProperties = Object.keys(value).some(
      key => value[key] !== undefined && value[key] !== ''
    );

    if (!hasValidProperties) {
      throw new BadRequestException('No valid properties provided for update. At least one valid property is required.');
    }

   
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed: ensure that the data provided is correct.');
    }

    
    const allowedKeys = Object.keys(new UpdateUserDto());

    const invalidKeys = Object.keys(value).filter(key => !allowedKeys.includes(key));

    
    const validProperties = Object.keys(object);

    if (invalidKeys.length > 0 && !validProperties.includes(invalidKeys[0])) {
      throw new BadRequestException(`Invalid properties: ${invalidKeys.join(', ')}`);
    }

    
    return object;
  }
}
