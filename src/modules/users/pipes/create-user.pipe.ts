import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class CreateUserPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    
    if (!this.toValidate(metatype)) {
      return value;
    }

    
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);

    
    if (errors.length > 0) {
      const errorMessages = errors.map(error =>
        Object.values(error.constraints).join(', ')
      ).join('; ');

      throw new BadRequestException(`Validation failed: ${errorMessages}`);
    }

    return object; 
  }

 
  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
