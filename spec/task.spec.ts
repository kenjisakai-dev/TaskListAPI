import request from "supertest";
import fs from "fs";
import { App } from "@src/app";
import { getDataSource } from "@src/database/dataSource";

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

  const response = await supertest.post("/api/v1/taskList/user/create").send({
    name: "Stella Luana Araújo",
    email: "stella_araujo@gmail.com",
    password: "oZeHnhj@BR7",
  });

  token = response.body.token;
});

afterAll(async () => {
  await getDataSource().destroy();
});

describe("Task", () => {
  test("Get User Tasks - Sucess User Without Tasks", async () => {
    const response = await supertest
      .get("/api/v1/taskList/task/getTasksByUser")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toStrictEqual({
      cod_user: 1,
      name: "Stella Luana Araújo",
      email: "stella_araujo@gmail.com",
      task: [],
    });
  });

  test("Create Task - Success", async () => {
    const response = await supertest
      .post("/api/v1/taskList/task/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Estudar JS",
        description: "Operadores Relacionais",
      });

    expect(response.statusCode).toEqual(201);
  });

  test("Create Task - Error Missing Data", async () => {
    const response = await supertest
      .post("/api/v1/taskList/task/create")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toEqual(400);
  });

  test("Get User Tasks - Success User With Tasks", async () => {
    const response = await supertest
      .get("/api/v1/taskList/task/getTasksByUser")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toStrictEqual({
      cod_user: 1,
      name: "Stella Luana Araújo",
      email: "stella_araujo@gmail.com",
      task: [
        {
          cod_task: 1,
          title: "Estudar JS",
          description: "Operadores Relacionais",
          status: {
            cod_status: 1,
            description: "New",
          },
        },
      ],
    });
  });

  test("Update Task - Success", async () => {
    const response = await supertest
      .patch("/api/v1/taskList/task/update")
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
      .patch("/api/v1/taskList/task/update")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toEqual(400);
    expect(response.body).toStrictEqual({
      message: "O código da tarefa é obrigatório.",
    });
  });

  test("Update Task - Error Not Found Task", async () => {
    const response = await supertest
      .patch("/api/v1/taskList/task/update")
      .set("Authorization", `Bearer ${token}`)
      .send({
        cod_task: 100,
        title: "Estudar JavaScript",
      });

    expect(response.statusCode).toEqual(404);
    expect(response.body).toStrictEqual({
      message: "A tarefa do usuário não foi encontrada.",
    });
  });

  test("Update Task - Error Not Found Status", async () => {
    const response = await supertest
      .patch("/api/v1/taskList/task/update")
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

  test("Get User Tasks - Validate Update", async () => {
    const response = await supertest
      .get("/api/v1/taskList/task/getTasksByUser")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toStrictEqual({
      cod_user: 1,
      name: "Stella Luana Araújo",
      email: "stella_araujo@gmail.com",
      task: [
        {
          cod_task: 1,
          title: "Estudar JavaScript",
          description: "Operadores Relacionais",
          status: {
            cod_status: 3,
            description: "Done",
          },
        },
      ],
    });
  });
});

describe("Task - User 2", () => {
  let tokenUser2: string;

  beforeAll(async () => {
    const response = await supertest.post("/api/v1/taskList/user/create").send({
      name: "Mariah Analu Lopes",
      email: "Mariah_lopes@gmail.com",
      password: "GltfOfq@J51",
    });

    tokenUser2 = response.body.token;
  });

  test("Create Task - Success", async () => {
    const response = await supertest
      .post("/api/v1/taskList/task/create")
      .set("Authorization", `Bearer ${tokenUser2}`)
      .send({
        title: "Estudar Node",
        description: "Gerenciamento de Pacotes",
      });

    expect(response.statusCode).toEqual(201);
  });

  test("Get User Tasks - Sucess User Without Tasks", async () => {
    const response = await supertest
      .get("/api/v1/taskList/task/getTasksByUser")
      .set("Authorization", `Bearer ${tokenUser2}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toStrictEqual({
      cod_user: 2,
      name: "Mariah Analu Lopes",
      email: "Mariah_lopes@gmail.com",
      task: [
        {
          cod_task: 2,
          title: "Estudar Node",
          description: "Gerenciamento de Pacotes",
          status: {
            cod_status: 1,
            description: "New",
          },
        },
      ],
    });
  });

  test("Update Task - Success", async () => {
    const response = await supertest
      .patch("/api/v1/taskList/task/update")
      .set("Authorization", `Bearer ${tokenUser2}`)
      .send({
        cod_task: 2,
        title: "Estudar NodeJS",
        cod_status: 2,
      });

    expect(response.statusCode).toEqual(200);
  });

  test("Update Task - Error Another Users Task", async () => {
    const response = await supertest
      .patch("/api/v1/taskList/task/update")
      .set("Authorization", `Bearer ${tokenUser2}`)
      .send({
        cod_task: 1,
        title: "Estudar NodeJS",
      });

    expect(response.statusCode).toEqual(404);
    expect(response.body).toStrictEqual({
      message: "A tarefa do usuário não foi encontrada.",
    });
  });

  test("Get User Tasks - Validate Update", async () => {
    const response = await supertest
      .get("/api/v1/taskList/task/getTasksByUser")
      .set("Authorization", `Bearer ${tokenUser2}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toStrictEqual({
      cod_user: 2,
      name: "Mariah Analu Lopes",
      email: "Mariah_lopes@gmail.com",
      task: [
        {
          cod_task: 2,
          title: "Estudar NodeJS",
          description: "Gerenciamento de Pacotes",
          status: {
            cod_status: 2,
            description: "Running",
          },
        },
      ],
    });
  });
});
