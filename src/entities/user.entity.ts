import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Task } from "@entities/task.entity";

@Entity("user")
export class User {
  @PrimaryGeneratedColumn()
  cod_user!: number;

  @Column({ type: "varchar" })
  name!: string;

  @Column({ type: "varchar", unique: true })
  email!: string;

  @Column({ type: "varchar" })
  password!: string;

  @OneToMany(() => Task, (task) => task.user)
  task!: Task[];
}
