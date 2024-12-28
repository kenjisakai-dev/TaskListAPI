import { Status } from "@entities/status.entity";
import { User } from "@entities/user.entity";

export interface ITask {
  cod_task: number;
  title: string;
  description: string;
  cod_user: number;
  user: User;
  cod_status: number;
  status: Status;
}
