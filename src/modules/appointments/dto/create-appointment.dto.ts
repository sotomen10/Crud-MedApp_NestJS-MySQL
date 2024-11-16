import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsNotEmpty()
  doctorId: string;

  @IsNotEmpty()
  patientId: string;

  @IsDateString() 
  date: string; 

  @IsNotEmpty()
  @IsString()
  time: string;

  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  specialty: string; 
  @IsNotEmpty()
  @IsString()
  reason: string;
}