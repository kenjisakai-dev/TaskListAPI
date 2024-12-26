import { injectable } from "tsyringe";
import { Repository } from "typeorm";
import { Task } from "../entities/task.entity";
import { ITask } from "../interface/task.interface";
import { getDataSource } from "../database/dataSource";

@injectable()
export class TaskRepository {
  private taskRepository: Repository<Task>;

  constructor() {
    this.taskRepository = getDataSource().getRepository(Task);
  }

  async createTask(task: ITask) {
    await this.taskRepository.save(task);
  }

  async getTask(cod_task: number) {
    return await this.taskRepository.findOne({
      where: { cod_task },
      relations: ["user", "status"],
      select: {
        cod_task: true,
        title: true,
        description: true,
        user: {
          cod_user: true,
          name: true,
          email: true,
        },
      },
    });
  }

  async updateTask(task: ITask) {
    const { cod_status, ...taskUpdate } = task;
    await this.taskRepository.update(task.cod_task, taskUpdate);
  }
}
