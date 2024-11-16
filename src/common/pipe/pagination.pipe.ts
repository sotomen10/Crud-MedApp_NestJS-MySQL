import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { PaginationDTO } from '../dto/pagination.dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PaginationValidationPipe implements PipeTransform {
  async transform(value: any) {
    const validKeys = Object.keys(new PaginationDTO());
    const invalidKeys = Object.keys(value).filter(key => !validKeys.includes(key));

    if (invalidKeys.length > 0) {
      throw new BadRequestException(`Invalid query: parameters ${invalidKeys.join(', ')} are not defined in the query.`);
    }

    const paginationDto = plainToInstance(PaginationDTO, value);
    const errors = await validate(paginationDto);

    if (errors.length > 0) {
      throw new BadRequestException('Validation failed: ' + JSON.stringify(errors));
    }

    // Set default values for pagination
    paginationDto.page = paginationDto.page ?? 1;
    paginationDto.limit = paginationDto.limit ?? 10;

    return paginationDto;
  }
}
