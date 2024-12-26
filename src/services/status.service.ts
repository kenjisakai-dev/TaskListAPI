import { NotFoundError } from "../helpers/apiError";
import statusRepository from "../repositories/status.repository";

async function getStatus(cod_status: number) {
  const status = await statusRepository.getStatus(cod_status);

  if (!status) {
    throw new NotFoundError("O status não foi encontrado.");
  }

  return status;
}

export default {
  getStatus,
};
