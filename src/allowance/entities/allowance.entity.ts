import { Position } from 'src/position/entities/position.entity';
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

  @ManyToOne(() => Position, (position) => position.allowences)
  position: Position;
}
