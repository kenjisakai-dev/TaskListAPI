import request from "supertest";
import fs from "fs";
import { App } from "../src/app";
import { getDataSource } from "../src/database/dataSource";

const app = new App().app;
let supertest = request(app);
let token: string;

beforeAll(async () => {
  if (process.env.NODE_ENV !== "TEST") {
    test.skip(
      "Testes ignorados pois o ambiente não está configurado corretamente"
    );
  }

  if (fs.existsSync(__dirname + "/database/TaskListTest.db")) {
    fs.unlinkSync(__dirname + "/database/TaskListTest.db");
  }

  await getDataSource().initialize();
  await getDataSource().runMigrations();

  await supertest.post("/api/v1/taskList/user/create").send({
    name: "Stella Luana Araújo",
    email: "stella_araujo@gmail.com",
    password: "oZeHnhj@BR7",
  });

  const data = await supertest.post("/api/v1/taskList/user/login").send({
    email: "stella_araujo@gmail.com",
    password: "oZeHnhj@BR7",
  });

  token = data.body.token;
});

afterAll(async () => {
  await getDataSource().destroy();
});

describe("Task", () => {
  test("Create Task - Success", async () => {
    const response = await supertest
      .post("/api/v1/taskList/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Estudar JS",
        description: "Operadores Relacionais",
      });

    expect(response.statusCode).toEqual(201);
  });

  test("Create Task - Error Missing Data", async () => {
    const response = await supertest
      .post("/api/v1/taskList/create")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toEqual(400);
  });

  test("Get Task - Success", async () => {
    const response = await supertest
      .get("/api/v1/taskList/get/1")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toStrictEqual({
      cod_task: 1,
      title: "Estudar JS",
      description: "Operadores Relacionais",
      user: {
        cod_user: 1,
        name: "Stella Luana Araújo",
        email: "stella_araujo@gmail.com",
      },
      status: {
        cod_status: 1,
        description: "New",
      },
    });
  });

  test("Get Task - Error Not Found Task", async () => {
    const response = await supertest
      .get("/api/v1/taskList/get/100")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toEqual(404);
    expect(response.body).toStrictEqual({
      message: "A Tarefa não foi encontrada.",
    });
  });

  test("Update Task - Success", async () => {
    const response = await supertest
      .patch("/api/v1/taskList/update")
      .set("Authorization", `Bearer ${token}`)
      .send({
        cod_task: 1,
        title: "Estudar JavaScript",
        cod_status: 3,
      });

    expect(response.statusCode).toEqual(200);
  });

  test("Update Task - Error Missing Data", async () => {
    const response = await supertest
      .patch("/api/v1/taskList/update")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toEqual(400);
  });

  test("Update Task - Error Not Found Task", async () => {
    const response = await supertest
      .patch("/api/v1/taskList/update")
      .set("Authorization", `Bearer ${token}`)
      .send({
        cod_task: 100,
        title: "Estudar JavaScript",
      });

    expect(response.statusCode).toEqual(404);
    expect(response.body).toStrictEqual({
      message: "A Tarefa não foi encontrada.",
    });
  });

  test("Update Task - Error Not Found Status", async () => {
    const response = await supertest
      .patch("/api/v1/taskList/update")
      .set("Authorization", `Bearer ${token}`)
      .send({
        cod_task: 1,
        cod_status: 100,
      });

    expect(response.statusCode).toEqual(404);
    expect(response.body).toStrictEqual({
      message: "O status não foi encontrado.",
    });
  });

  test("Get Task - Validate Update", async () => {
    const response = await supertest
      .get("/api/v1/taskList/get/1")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toStrictEqual({
      cod_task: 1,
      title: "Estudar JavaScript",
      description: "Operadores Relacionais",
      user: {
        cod_user: 1,
        name: "Stella Luana Araújo",
        email: "stella_araujo@gmail.com",
      },
      status: {
        cod_status: 3,
        description: "Done",
      },
    });
  });
});
