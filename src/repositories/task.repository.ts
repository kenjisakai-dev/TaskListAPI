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

  async getTaskByUserAndTask(cod_user: number, cod_task: number) {
    return await this.taskRepository.findOne({
      where: {
        cod_task,
        user: {
          cod_user,
        },
      },
    });
  }

  async updateTask(task: ITask) {
    const { cod_user, user, cod_status, ...taskUpdate } = task;
    await this.taskRepository.update(task.cod_task, taskUpdate);
  }
}
