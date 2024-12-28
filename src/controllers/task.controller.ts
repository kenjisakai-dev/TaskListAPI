import { Request, Response } from "express";
import { container, injectable } from "tsyringe";
import { BadRequestError } from "@helpers/apiError";
import { ITask } from "@interface/task.interface";
import { TaskService } from "@services/task.service";

@injectable()
export class TaskController {
  async createTask(req: Request, res: Response) {
    const data: ITask = req.body;
    const { title, description } = data;

    if (!title || !description) {
      throw new BadRequestError("O título e descrição são obrigatórios.");
    }

    const taskService = container.resolve(TaskService);
    await taskService.createTask(data);

    res.status(201).json();
  }

  async getTasksByUser(req: Request, res: Response) {
    const { cod_user }: ITask = req.body;

    const taskService = container.resolve(TaskService);
    const response = await taskService.getTasksByUser(cod_user);

    res.status(200).json(response);
  }

  async updateTask(req: Request, res: Response) {
    const task: ITask = req.body;
    const { cod_task } = task;

    if (!cod_task) {
      throw new BadRequestError("O código da tarefa é obrigatório.");
    }

    const taskService = container.resolve(TaskService);
    await taskService.updateTask(task);

    res.status(200).json();
  }
}
