import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { Patient } from "../../patients/entities/patient.entity";
import { User } from "../../users/entities/user.entity";

@Entity()
export class Appointment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    createdAt: Date;

    @CreateDateColumn()
    updatedAt: Date;

    @Column()
    date: Date;

    @Column()
    time: string;

    @Column()
    description: string;

    @Column({ default: 'pending' })
    status: string; // Options: 'pending', 'confirmed', 'completed', etc.

    @Column()
    specialty: string; // Nueva columna para la especialidad del médico

    @Column()
    reason: string; // Nueva columna para el motivo de la cita

    @ManyToOne(() => User, user => user.appointments)
    doctor: User; // Relación con User (médico)

    @ManyToOne(() => Patient, patient => patient.appointments)
    patient: Patient; // Relación con Patient (paciente)
}
