import { container, injectable } from "tsyringe";
import { NotFoundError } from "../helpers/apiError";
import { ITask } from "../interface/task.interface";
import { TaskRepository } from "../repositories/task.repository";
import statusService from "./status.service";

@injectable()
export class TaskService {
  async createTask(data: ITask) {
    data.status = await statusService.getStatus(1);

    const taskRepository = container.resolve(TaskRepository);
    await taskRepository.createTask(data);
  }

  async getTask(cod_task: number) {
    const taskRepository = container.resolve(TaskRepository);
    const task = await taskRepository.getTask(cod_task);

    if (!task) {
      throw new NotFoundError("A Tarefa não foi encontrada.");
    }

    return task;
  }

  async updateTask(data: ITask) {
    await this.getTask(data.cod_task);

    if (data.cod_status) {
      data.status = await statusService.getStatus(data.cod_status);
    }

    const taskRepository = container.resolve(TaskRepository);
    await taskRepository.updateTask(data);
  }
}
