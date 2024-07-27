import { Employee } from 'src/employee/entities/employee.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Allowance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  allowenceType: string;

  @Column()
  allowanceValue: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Employee, (employee) => employee.allowences)
  employee: Employee;
}
