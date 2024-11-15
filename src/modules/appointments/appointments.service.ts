import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between,Like } from 'typeorm';
import { Appointment } from '../appointments/entities/appointment.entity';
import { User } from '../users/entities/user.entity';
import { Patient } from '../patients/entities/patient.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>
  ) {}

  private convertToUtcDate(date: Date, time: string): Date {
    const [timePart, modifier] = time.split(' '); // Split time into parts
    let [hours, minutes] = timePart.split(':').map(Number);

    // Convert to 24-hour format
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    // Set the time on the provided date and convert to UTC
    date.setHours(hours, minutes, 0, 0);
    return new Date(date.toISOString()); // Ensure UTC time
  }

  async createAppointment(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    const { doctorId, patientId, date, time, description, specialty, reason } = createAppointmentDto;

    const appointmentDate = new Date(date); // Parse the date from the request (UTC)

    const doctor = await this.userRepository.findOne({ where: { id: doctorId } });
    if (!doctor) {
      throw new NotFoundException('Médico no encontrado');
    }

    const patient = await this.patientRepository.findOne({ where: { id: patientId } });
    if (!patient) {
      throw new NotFoundException('Paciente no encontrado');
    }

    // Convert the provided time to UTC and set it to the appointment date
    const appointmentDateWithTime = this.convertToUtcDate(appointmentDate, time);

    // Calculate range for conflict validation
    const startRange = new Date(appointmentDateWithTime);
    const endRange = new Date(appointmentDateWithTime);
    startRange.setMinutes(startRange.getMinutes() - 30); // Start range: 30 minutes before
    endRange.setMinutes(endRange.getMinutes() + 30); // End range: 30 minutes after

    console.log('Validating appointment within range:', {
      startRange,
      endRange,
    });

    // Check for overlapping appointments
    const conflictingAppointments = await this.appointmentRepository.find({
      where: {
        doctor: { id: doctorId },
        date: Between(startRange, endRange),
      },
    });

    console.log('Conflicting appointments found:', conflictingAppointments);

    if (conflictingAppointments.length > 0) {
      throw new BadRequestException('El médico ya tiene una cita dentro de los 30 minutos de esta hora.');
    }

    // Create the new appointment
    const newAppointment = this.appointmentRepository.create({
      date: appointmentDateWithTime,
      time,
      description,
      specialty,
      reason,
      doctor,
      patient,
    });

    console.log('Saving new appointment:', newAppointment);

    return this.appointmentRepository.save(newAppointment);
  }




  async filterAppointments({
    date,
    specialty,
    reason,
  }: {
    date?: string; // Fecha en formato ISO
    specialty?: string;
    reason?: string;
  }): Promise<Appointment[]> {
    const where: any = {};

    if (date) {
      const parsedDate = new Date(date);
      const startOfDay = new Date(parsedDate.setUTCHours(0, 0, 0, 0));
      const endOfDay = new Date(parsedDate.setUTCHours(23, 59, 59, 999));

      where.date = Between(startOfDay, endOfDay); // Filtro por rango de la fecha
    }

    if (specialty) {
      where.specialty = Like(`%${specialty}%`); // Filtro por especialidad (parcial)
    }

    if (reason) {
      where.reason = Like(`%${reason}%`); // Filtro por motivo (parcial)
    }

    const appointments = await this.appointmentRepository.find({
      where,
      relations: ['doctor', 'patient'], // Incluye las relaciones para devolver información completa
    });

    return appointments;
  }

  async updateDescription(id: string, newDescription: string): Promise<Appointment> {
    // Buscar la cita por ID
    const appointment = await this.appointmentRepository.findOne({ where: { id } });
    
    // Si no se encuentra la cita, lanzamos un error
    if (!appointment) {
      throw new NotFoundException('Cita no encontrada');
    }

    // Actualizar la descripción de la cita
    appointment.description = newDescription;

    // Guardar la cita con la nueva descripción
    return this.appointmentRepository.save(appointment);
  }
}



