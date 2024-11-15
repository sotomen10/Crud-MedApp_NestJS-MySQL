import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsNotEmpty()
  doctorId: string;

  @IsNotEmpty()
  patientId: string;

  @IsDateString() // Asegura que la cadena sea una fecha válida
  date: string; // Recibe la fecha como string pero se convierte luego a Date

  @IsNotEmpty()
  @IsString()
  time: string;

  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  specialty: string; // Nueva propiedad para la especialidad del médico

  @IsNotEmpty()
  @IsString()
  reason: string; // Nueva propiedad para el motivo de la cita
}