import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { Appointment } from "../../appointments/entities/appointment.entity";

@Entity()
export class Patient {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    createdAt: Date;

    @CreateDateColumn()
    updatedAt: Date;

    @Column()
    fullName: string;

    @Column()
    dateOfBirth: Date;

    @Column()
    gender: string;

    @Column({ unique: true })
    contactNumber: string;

    @Column()
    address: string;

    @OneToMany(() => Appointment, appointment => appointment.patient)
    appointments: Appointment[];
}


