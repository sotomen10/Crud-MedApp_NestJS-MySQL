import { Controller, Post, Body ,Get,Query,Patch,Param, UseGuards} from '@nestjs/common';
import { AppointmentService } from '../appointments/appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Appointment } from '../appointments/entities/appointment.entity';
import { ApiQuery } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/jwt-roles.guard';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @UseGuards(JwtAuthGuard)  
  @Post()
  async create(@Body() createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    return this.appointmentService.createAppointment(createAppointmentDto);
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Patch(':id/description')
  async updateDescription(
    @Param('id') id: string, 
    @Body('description') description: string, 
  ): Promise<Appointment> {
    return this.appointmentService.updateDescription(id, description);
  }

}