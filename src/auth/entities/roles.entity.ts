import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from "typeorm";
import { User } from '../../modules/users/entities/user.entity'; 

@Entity()
export class Role {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @ManyToMany(() => User, user => user.roles)
    users: User[];
}

