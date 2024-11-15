import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}

  // Create a new patient
  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    const patient = this.patientRepository.create(createPatientDto);
    return await this.patientRepository.save(patient);
  }

  // Get all patients
  async findAll(): Promise<Patient[]> {
    return await this.patientRepository.find();
  }

  // Get a patient by id
  async findOne(id: string): Promise<Patient> {
    return await this.patientRepository.findOne({
      where: { id }, // Use `where` to pass the condition
    });
  }

  // Update patient information
  async update(id: string, updatePatientDto: UpdatePatientDto): Promise<Patient> {
    await this.patientRepository.update(id, updatePatientDto);
    return this.patientRepository.findOne({
      where: { id }, // Use `where` for consistency
    });
  }

  // Delete a patient
  async remove(id: string): Promise<void> {
    await this.patientRepository.delete(id);
  }
}
