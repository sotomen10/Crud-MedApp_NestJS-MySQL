import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { PaginationDTO } from '../dto/pagination.dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PaginationValidationPipe implements PipeTransform {
  async transform(value: any) {
    // Comprueba si hay claves inválidas en la consulta antes de la conversión
    const validKeys = Object.keys(new PaginationDTO());
    const invalidKeys = Object.keys(value).filter(key => !validKeys.includes(key));
    console.log(validKeys)
    console.log(invalidKeys)

    // Si hay parámetros inválidos, lanza una excepción
    if (invalidKeys.length > 0) {
      throw new BadRequestException(`Invalid query: parameters ${invalidKeys.join(', ')} are not defined in the query.`);
    }

    // Convierte el valor recibido a una instancia de PaginationDto
    const paginationDto = plainToInstance(PaginationDTO, value);

    // Valida el objeto
    const errors = await validate(paginationDto);

    // Si hay errores de validación, lanza una excepción
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed: ' + JSON.stringify(errors));
    }

    // Asigna valores predeterminados si no se proporcionan
    paginationDto.page = paginationDto.page ?? 1;
    paginationDto.limit = paginationDto.limit ?? 10;

    return paginationDto; 
  }
}