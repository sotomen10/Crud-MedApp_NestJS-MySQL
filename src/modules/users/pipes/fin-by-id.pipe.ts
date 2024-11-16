import {
    ArgumentMetadata,
    BadRequestException,
    Inject,
    Injectable,
    PipeTransform,
  } from '@nestjs/common';
  import { FindById } from '../dto/find-by-Id.dto';
  import { plainToInstance } from 'class-transformer';
  import { validate } from 'class-validator';
  import { UsersService } from '../users.service';
  
  @Injectable()
  export class FindByIdPipeCustom implements PipeTransform {
    constructor(@Inject() private userService: UsersService) {}
  
    async transform(value: any, { metatype }: ArgumentMetadata) {

      if (metatype !== FindById) {
        return value;
      }
      const object = plainToInstance(FindById, { id: value });
  
      const user = await this.userService.findOne({ id: value });
      if (!user) {
        throw new BadRequestException('The ID was not found.');
      }
      const errors = await validate(object);
      if (errors.length > 0) {
        throw new BadRequestException('Validation error: Invalid format for ID.');
      }
  
      return value;
    }
  }
  
  