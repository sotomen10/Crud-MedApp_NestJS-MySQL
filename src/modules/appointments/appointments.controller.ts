import { Controller, Post, Body ,Get,Query,Patch,Param} from '@nestjs/common';
import { AppointmentService } from '../appointments/appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Appointment } from '../appointments/entities/appointment.entity';
import { ApiQuery } from '@nestjs/swagger'

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  async create(@Body() createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    return this.appointmentService.createAppointment(createAppointmentDto);
  }

  @Get('filter')
  @ApiQuery({ name: 'date', required: false, description: 'Date in ISO format' })
  @ApiQuery({ name: 'specialty', required: false, description: 'Medical specialty' })
  @ApiQuery({ name: 'reason', required: false, description: 'Reason for the appointment' })
  
  async filterAppointments(
    @Query('date') date?: string, 
    @Query('specialty') specialty?: string, 
    @Query('reason') reason?: string, 
  ): Promise<Appointment[]> {
    return this.appointmentService.filterAppointments({ date, specialty, reason });
  }


  @Patch(':id/description')
  async updateDescription(
    @Param('id') id: string, 
    @Body('description') description: string, 
  ): Promise<Appointment> {
    return this.appointmentService.updateDescription(id, description);
  }

}