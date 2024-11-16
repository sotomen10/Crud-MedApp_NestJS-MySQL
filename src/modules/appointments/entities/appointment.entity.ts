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
    specialty: string; 

    @Column()
    reason: string; 

    @ManyToOne(() => User, user => user.appointments)
    doctor: User;

    @ManyToOne(() => Patient, patient => patient.appointments)
    patient: Patient; 
}
