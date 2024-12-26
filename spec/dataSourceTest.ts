import { DataSource } from "typeorm";

export const AppDataSourceTest = new DataSource({
  type: "sqlite",
  database: __dirname + "/database/TaskListTest.db",
  entities: [__dirname + "/../src/entities/*.ts"],
  migrations: [__dirname + "/migrations/*.ts"],
  synchronize: false,
  logging: false,
});
