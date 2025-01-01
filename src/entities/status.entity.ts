import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Task } from "@entities/task.entity";

@Entity()
export class Status {
  @PrimaryGeneratedColumn()
  cod_status!: number;

  @Column({ type: "varchar" })
  description!: string;

  @OneToMany(() => Task, (task) => task.status)
  task!: Task[];
}
