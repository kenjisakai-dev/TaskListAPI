import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Status } from "./status.entity";
import { User } from "./user.entity";

@Entity("task")
export class Task {
  @PrimaryGeneratedColumn()
  cod_task!: number;

  @Column({ type: "varchar" })
  title!: string;

  @Column({ type: "text" })
  description!: string;

  @ManyToOne(() => User, (user) => user.task, {
    cascade: true,
    nullable: false,
  })
  @JoinColumn({ name: "cod_user" })
  user!: User;

  @ManyToOne(() => Status, (status) => status.task, {
    cascade: true,
    nullable: false,
  })
  @JoinColumn({ name: "cod_status" })
  status!: Status;
}
