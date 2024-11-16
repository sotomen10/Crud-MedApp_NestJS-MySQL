import { IsString, IsDateString, IsPhoneNumber } from 'class-validator';

export class CreatePatientDto {
  @IsString()
  fullName: string;

  @IsDateString()
  dateOfBirth: Date;

  @IsString()
  gender: string;

  @IsPhoneNumber()
  contactNumber: string;

  @IsString()
  address: string;
}