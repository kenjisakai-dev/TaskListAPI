import request from "supertest";
import fs from "fs";
import { App } from "@src/app";
import { getDataSource } from "@src/database/dataSource";

const app = new App().app;
const supertest = request(app);

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
});

afterAll(async () => {
  await getDataSource().destroy();
});

describe("User", () => {
  test("Create User - Success", async () => {
    const response = await supertest.post("/api/v1/taskList/user/create").send({
      name: "Stella Luana Araújo",
      email: "stella_araujo@gmail.com",
      password: "oZeHnhj@BR7",
    });

    expect(response.statusCode).toEqual(201);
    expect(response.body).toHaveProperty("token");
    expect(typeof response.body.token).toEqual("string");
  });

  test("Create User - Error Missing Data", async () => {
    const response = await supertest.post("/api/v1/taskList/user/create");

    expect(response.statusCode).toEqual(400);
    expect(response.body).toStrictEqual({
      message: "O nome, email e senha são obrigatórios.",
    });
  });

  test("Create User - Error Invalid Email", async () => {
    const response = await supertest.post("/api/v1/taskList/user/create").send({
      name: "Stella Luana Araújo",
      email: "stella_araujogmail",
      password: "oZeHnhj@BR7",
    });

    expect(response.statusCode).toEqual(400);
    expect(response.body).toStrictEqual({
      message: "Email Inválido.",
    });
  });

  test("Create User - Error Invalid Password", async () => {
    const response = await supertest.post("/api/v1/taskList/user/create").send({
      name: "Stella Luana Araújo",
      email: "stella_araujo@gmail.com",
      password: "a ",
    });

    expect(response.statusCode).toEqual(400);
    expect(response.body).toStrictEqual({
      message: [
        "A senha deve possuir no mínimo 8 caracteres",
        "Deve possuir pelo menos 1 caractere maiúsculo",
        "Deve possuir pelo menos 1 número",
        "Deve possuir pelo menos 1 simbolo",
        "Não deve possuir espaços",
      ],
    });
  });

  test("Create User - Error Email Existing", async () => {
    const response = await supertest.post("/api/v1/taskList/user/create").send({
      name: "Stella Luana Araújo",
      email: "stella_araujo@gmail.com",
      password: "oZeHnhj@BR7",
    });

    expect(response.statusCode).toEqual(400);
    expect(response.body).toStrictEqual({
      message: "E-mail já cadastrado.",
    });
  });

  test("Login User - Sucess Login", async () => {
    const response = await supertest.post("/api/v1/taskList/user/login").send({
      email: "stella_araujo@gmail.com",
      password: "oZeHnhj@BR7",
    });
    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveProperty("token");
    expect(typeof response.body.token).toEqual("string");
  });

  test("Login User - Error Missing Data", async () => {
    const response = await supertest.post("/api/v1/taskList/user/login");

    expect(response.statusCode).toEqual(401);
    expect(response.body).toStrictEqual({ message: "Login Inválido." });
  });

  test("Login User - Error Email Inexisting", async () => {
    const response = await supertest.post("/api/v1/taskList/user/login").send({
      email: "stella123@gmail.com",
      password: "oZeHnhj@BR7",
    });

    expect(response.statusCode).toEqual(401);
    expect(response.body).toStrictEqual({ message: "Login Inválido." });
  });

  test("Login User - Error Password Invalid", async () => {
    const response = await supertest.post("/api/v1/taskList/user/login").send({
      email: "stella_araujo@gmail.com",
      password: "stela@BR7",
    });

    expect(response.statusCode).toEqual(401);
    expect(response.body).toStrictEqual({ message: "Login Inválido." });
  });
});
