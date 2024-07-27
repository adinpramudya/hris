import { IsOptional } from 'class-validator';
import { Allowance } from 'src/allowance/entities/allowance.entity';
import { EmployeeType, Gender, MaritalStatus } from 'src/enums/enum';
import { Position } from 'src/position/entities/position.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  placeOfBirth: string;

  @Column()
  dateOfBirth: Date;

  @Column()
  email: string;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Column({ nullable: true })
  @IsOptional()
  rekeningNumber?: string;

  @Column()
  address: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: false })
  isActive: boolean;

  @Column()
  paidLeave: number;

  @Column({ type: 'enum', enum: EmployeeType, nullable: true })
  employeeType: EmployeeType;

  @Column({ type: 'decimal' })
  salaryBasic: number;

  @ManyToOne(() => Position, (position) => position.employees)
  position: Position;

  @OneToMany(() => Allowance, (allowence) => allowence.employee, {
    cascade: true,
  })
  allowences: Allowance[];

  @OneToOne(() => User, (user) => user.employee)
  user: User;

  @Column()
  nik: string;

  @Column({
    type: 'enum',
    enum: MaritalStatus,
  })
  maritalStatus: MaritalStatus;

  @Column()
  dateOfEntry: Date;

  @Column({ type: 'int', default: 0 })
  numberOfChildren: number;

  @Column()
  npwp: string;

  @Column({ nullable: true })
  periodeEndDate: Date;
}
