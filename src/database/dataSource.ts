import { DataSource } from "typeorm";
import env from "@config/environment";
import { AppDataSourceTest } from "@spec/dataSourceTest";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: env.host,
  port: Number(env.port),
  username: env.username,
  password: env.password,
  database: env.database,
  entities: [__dirname + "/../entities/*.ts"],
  migrations: [__dirname + "/../migrations/*.ts"],
});

export const getDataSource = () => {
  if (process.env.NODE_ENV === "TEST") {
    return AppDataSourceTest;
  } else {
    return AppDataSource;
  }
};
