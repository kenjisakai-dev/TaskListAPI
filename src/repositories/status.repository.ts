import { getDataSource } from "@database/dataSource";
import { Status } from "@entities/status.entity";

const statusRepository = getDataSource().getRepository(Status);

async function getStatus(cod_status: number) {
  return await statusRepository.findOneBy({ cod_status });
}

export default {
  getStatus,
};
