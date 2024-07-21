import { IsOptional } from 'class-validator';
import { Position } from 'src/position/entities/position.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
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

  @Column()
  gender: string;

  @Column({ nullable: true }) // Allow null values in the database
  @IsOptional() // Make the field optional in validation
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

  @Column()
  employeeType: string;

  @OneToOne(() => Position)
  @JoinColumn()
  position: Position;

  @OneToOne(() => User, (user) => user.employee)
  user: User;
}
