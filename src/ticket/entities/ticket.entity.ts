import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { TicketType } from "../enum/type.enum";
import { TicketStatus } from "../enum/status.enum";

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ default: TicketType.INFO })
  type: string;

  @Column()
  description: string;

  @Column({ default: TicketStatus.OPEN })
  status: string;

  @Column()
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
