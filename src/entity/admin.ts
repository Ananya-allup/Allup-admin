import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { Role } from './role';
export enum Gym {
    '25_GYM' = '25 gym',
    'BIDO_GYM' = 'Bido gym',
    'EXTREME_GYM' = 'extreme gym',
}

export enum Gender {
    ANY = 'ANY',
    MALE = 'MALE',
    FEMALE = 'FEMALE'
}

export enum Status {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE'
}

export enum AdminType {
    GLOBAL = 'GLOBAL',
    BRANCH = 'BRANCH'
}

@Entity('admins')
export class Admin extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100 })
    firstName: string;

    @Column({ type: 'varchar', length: 100 })
    lastName: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 15, nullable: true })
    contactNumber: string;

    @Column({ type: 'enum', enum: Gender, default: Gender.ANY })
    gender: Gender;

    @Column({ type: 'enum', enum: Status, default: Status.ACTIVE })
    status: Status;

    @Column({ type: 'enum', enum: AdminType })
    adminType: AdminType;

    @Column('text', { array: true })
    referenceTypeId: Gym[];

    // Assuming you have a Role entity
    @ManyToOne(() => Role)
    @JoinColumn({ name: 'role_id', referencedColumnName: 'id' })
    role: Role;

    @Column({ type: 'varchar', select: false }) // select: false means this field won't be selected by default in queries
    password: string;
}


