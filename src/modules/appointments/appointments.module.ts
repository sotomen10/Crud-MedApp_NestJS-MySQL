import { Module } from '@nestjs/common';
import { AppointmentService } from './appointments.service';
import { AppointmentController } from './appointments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Appointment } from './entities/appointment.entity';
import { Patient } from '../patients/entities/patient.entity';

@Module({
  imports:[TypeOrmModule.forFeature([User,Appointment,Patient])],
  controllers: [AppointmentController],
  providers: [AppointmentService],
})
export class AppointmentsModule {}
