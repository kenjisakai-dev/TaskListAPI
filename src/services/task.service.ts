import { container, injectable } from "tsyringe";
import { NotFoundError } from "@helpers/apiError";
import { ITask } from "@interface/task.interface";
import { TaskRepository } from "@repositories/task.repository";
import { UserRepository } from "@repositories/user.repository";
import statusService from "@services/status.service";

@injectable()
export class TaskService {
  async createTask(data: ITask) {
    data.status = await statusService.getStatus(1);

    const taskRepository = container.resolve(TaskRepository);
    await taskRepository.createTask(data);
  }

  async getTasksByUser(cod_user: number) {
    const userRepository = container.resolve(UserRepository);
    return await userRepository.getTasksByUser(cod_user);
  }

  async updateTask(data: ITask) {
    const taskRepository = container.resolve(TaskRepository);
    const task = await taskRepository.getTaskByUserAndTask(
      data.cod_user,
      data.cod_task
    );

    if (!task) {
      throw new NotFoundError("A tarefa do usuário não foi encontrada.");
    }

    if (data.cod_status) {
      data.status = await statusService.getStatus(data.cod_status);
    }

    await taskRepository.updateTask(data);
  }
}
