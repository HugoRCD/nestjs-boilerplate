import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { IsAlpha, IsEmail, IsNotEmpty } from "class-validator";
import { Role } from "../../auth/decorators/role.decorator";
import { Exclude } from "class-transformer";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Column({ unique: true })
  username: string;

  @IsAlpha()
  @Column()
  firstname: string;

  @IsAlpha()
  @Column()
  lastname: string;

  @IsEmail()
  @Column({ unique: true })
  email: string;

  @Exclude({ toPlainOnly: true })
  @Column()
  password: string;

  @Exclude({ toPlainOnly: true })
  @Column({ length: 600, nullable: true })
  refreshToken: string;

  @Column({ default: Role.USER })
  role: number;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: null, length: 1500, nullable: true })
  avatar: string;

  @Column({ default: false })
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
