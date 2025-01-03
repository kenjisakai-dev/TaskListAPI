# TaskListAPI

A API TaskList permite o gerenciamento das tarefas dos usuários. Sendo possível o acompanhamento dos status das tarefas, além de gerenciar a criação de usuários e processos de login.

## Modelo Relacional da API

-   A tabela user possui informações dos usuários
-   A tabela status define os diferentes status que uma tarefa pode ter (1-New, 2-Running, 3-Done)
-   A tabela task gerencia as tarefas associadas aos usuários

![Diagrama Entidade Relacionamento da TaskListAPI](docs/der-TaskListAPI.png)

## 🚀 Tecnologias Utilizadas

As bibliotecas que têm o prefixo `@types/` são pacotes que fornecem definições de tipos para bibliotecas JavaScript que são utilizadas no TypeScript.

#### Criação da API

-   O **`typescript`** foi utilizado para criar a API usando o TypeScript que possibilita o uso de tipagem estática.

-   O **`express`** é um framework para Node.js utilizado para facilitar a criação de APIs.

-   O **`@types/node`** é utilizado para fornecer definições de tipo TypeScript para os módulos do NodeJS.

-   O **`ts-node`** é utilizado para executar TypeScript no NodeJS sem precisar compilar para JavaScript.

-   O **`tsx`** é utilizado para executar TypeScript sem a necessidade de compilação prévia para JavaScript.

-   O **`cross-env`** é uma ferramenta que permite definir variáveis de ambiente no NodeJS independente do sistema operacional.

-   O **`dotenv`** é utilizado para carregar variáveis de ambiente a partir de um arquivo **`.env`**.

-   O **`tsyringe`** é utilizado para gerenciar as injeções de dependências.

-   O **`tsconfig-paths`** é utilizado para ajudar a resolver os caminhos personalizados definidos no arquivo de configuração do TypeScript `tsconfig.json`.

#### Banco de Dados

-   O **`typeORM`** é utilizado para interagir com o bancos de dados relacional.

-   O **`reflect-metadata`** é utilizado para adicionar suporte a metadados para decoradores do TypeScript. Integrado ao projeto para permitir o uso de decorators do TypeORM no TypeScript.

-   O **`mysql2`** é utilizado para permitir a interação com bancos de dados MySQL.

-   O **`sqlite3`** é utilizado para interagir com o bancos de dados relacional local. Integrado ao projeto para interagir com o banco de dados de teste.

#### Testes

-   O **`jest`** é utilizado para criar testes. Integrado ao projeto junto com supertest para criar testes automatizados E2E.

-   O **`ts-jest`** é utilizado para criar testes usando o Jest no TypeScript (permissão o uso do import ESModules no Jest).

-   O **`supertest`** é utilizado para criar testes HTTP.

#### Validação de Dados

-   O **`validator`** é utilizado para validar dados. Integrado ao projeto para validar os emails fornecidos pelo usuário na criação e atualização.

-   O **`password-validator`** é utilizado para validar senhas. Integrado ao projeto para validar as senhas fornecidos pelo usuário na criação e atualização.

#### Segurança

-   O **`bcrypt`** é utilizado para criar hashing de senhas. Integrado ao projeto para criptografar as senhas dos usuários.

-   O **`jsonwebtoken`** é utilizado para criar a autenticação e autorização usando tokens JWT. Integrado ao projeto para criar a autenticação dos usuários.

#### Tratamento de erros

-   O **`express-async-errors`** é utilizado para gerenciar o tratamento de erros em funções assíncronas no Express. Evitando a necessidade de usar **`try-catch`** em muitos casos, quando há um middleware global de erros.

#### Documentação

-   O **`swagger-ui-express`** é utilizado para integrar a documentação swagger com interface gráfica que facilidade o teste dos endpoints da API

## 🛠️ Como executar o projeto

1. Instale as dependências do projeto

    ```sh
    npm install
    ```

2. Criação das variáveis de ambiente

    1. Crie um arquivo chamado `.env` na raiz do projeto
    2. Declare as variávis de ambiente do banco de dados e gere uma senha qualquer com aproximadamente 32 caracteres para utilizar como chave secreta do JsonWebToken.

        ```
        DB_USERNAME = "usuário"
        DB_PASSWORD = "senha"
        DB_HOST = "servidor-banco"
        DB_DATABASE = "nome-banco"

        SECRET_KEY = "chave secreta JWT"
        ```

3. Execute o comando para gerar as tabelas no banco de dados (os dados de status serão criados automaticamente durante a geração das tabelas, pois os comandos necessários para inserção desses valores estão definidos diretamente nas migrações)

    ```sh
    npm run migration:up
    ```

4. Inicie a API

    ```sh
    npm run start
    ```

-   A API possuí uma documentação swagger que pode ser acessada na rota `http://localhost:3000/swagger`

## 🧪 Como testar a API

Execute o comando para rodar os testes automatizados dos endpoints

```sh
npm run test
```

## 🔛 Como consultar os endpoints

### Usuarios

<details>
  <summary>POST /api/v1/taskList/user/create - Endpoint responsável por cadastrar um novo usuário</summary>

#### **Parâmetros da Requisição**

| **Tipo** | **Parâmetro** | **Descrição**    | **Obrigatório** |
| -------- | ------------- | ---------------- | --------------- |
| body     | `name`        | Nome do usuário  | Sim             |
| body     | `email`       | Email do usuário | Sim             |
| body     | `password`    | Senha do usuário | Sim             |

#### **Respostas da Requisição**

| **Código** | **Status**  | **Descrição**                        |
| ---------- | ----------- | ------------------------------------ |
| 201        | Created     | O usuário foi cadastrado com sucesso |
| 400        | Bad Request | Houve um erro ao cadastrar o usuário |

#### **Resposta 201 do endpoint**

```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2RfdXNlciI6MSwiaWF0IjoxNzM1MjU0ODQ0LCJleHAiOjE3MzUzNDEyNDR9.pvZW8n863bozAqQ53H-c_67aBim2P8RukO4W1hldpYM"
}
```

</details>

<details>
  <summary>POST /api/v1/taskList/user/login - Endpoint responsável por fazer o login do usuário e obter o token de acesso</summary>

#### **Parâmetros da Requisição**

| **Tipo** | **Parâmetro** | **Descrição**    | **Obrigatório** |
| -------- | ------------- | ---------------- | --------------- |
| body     | `email`       | Email do usuário | Sim             |
| body     | `password`    | Senha do usuário | Sim             |

#### **Respostas da Requisição**

| **Código** | **Status**   | **Descrição**               |
| ---------- | ------------ | --------------------------- |
| 200        | Ok           | O usuário logou com sucesso |
| 400        | Bad Request  | Houve um erro ao logar      |
| 401        | Unauthorized | Login Inválido.             |

#### **Resposta 200 do endpoint**

```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2RfdXNlciI6MSwiaWF0IjoxNzM1MjU0ODYxLCJleHAiOjE3MzUzNDEyNjF9.prKOlTjbU4KzwZv7CqV1SLfAM-LglulV5OAlYmrkuhA"
}
```

</details>

### Tarefas

<details>
  <summary>POST /api/v1/taskList/task/create - Endpoint responsável por cadastrar uma nova tarefa</summary>

<br>

> A API utiliza um middleware que verifica o token JWT fornecido na requisição. Se o token for válido, ele é decodificado para extrair os dados do usuário. Com essas informações conseguimos vincular a tarefa ao usuário.

#### **Parâmetros da Requisição**

| **Tipo** | **Parâmetro**   | **Descrição**       | **Obrigatório** |
| -------- | --------------- | ------------------- | --------------- |
| headers  | `authorization` | Token de acesso     | Sim             |
| body     | `title`         | Título da tarefa    | Sim             |
| body     | `description`   | Descrição da tarefa | Sim             |

#### **Respostas da Requisição**

| **Código** | **Status**   | **Descrição**                       |
| ---------- | ------------ | ----------------------------------- |
| 201        | Created      | A tarefa foi cadastrada com sucesso |
| 400        | Bad Request  | Houve um erro ao cadastrar a tarefa |
| 401        | Unauthorized | O token de acesso é obrigatório.    |
| 403        | Forbbiden    | O token de acesso é inválido.       |

</details>

<details>
  <summary>GET /api/v1/taskList/task/getTasksByUser - Endpoint responsável por obter as tarefas do usuário</summary>

<br>

> A API utiliza um middleware que verifica o token JWT fornecido na requisição. Se o token for válido, ele é decodificado para extrair os dados do usuário. Com essas informações conseguimos obter as tarefas vinculadas ao usuário.

#### **Parâmetros da Requisição**

| **Tipo** | **Parâmetro**   | **Descrição**   | **Obrigatório** |
| -------- | --------------- | --------------- | --------------- |
| headers  | `authorization` | Token de acesso | Sim             |

#### **Respostas da Requisição**

| **Código** | **Status**   | **Descrição**                                   |
| ---------- | ------------ | ----------------------------------------------- |
| 200        | Ok           | As tarefas do usuário foram obtidas com sucesso |
| 400        | Bad Request  | Houve um erro ao obter as tarefas do usuário    |
| 401        | Unauthorized | O token de acesso é obrigatório.                |
| 403        | Forbidden    | O token de acesso é inválido.                   |

#### **Resposta 200 do endpoint**

```json
{
    "cod_user": 1,
    "name": "Stella Luana Araújo",
    "email": "stella_araujo@gmail.com",
    "task": [
        {
            "cod_task": 1,
            "title": "Estudar JS",
            "description": "Operadores Relacionais",
            "status": {
                "cod_status": 1,
                "description": "New"
            }
        },
        {
            "cod_task": 2,
            "title": "Estudar JS",
            "description": "Operadores Aritméticos",
            "status": {
                "cod_status": 3,
                "description": "Done"
            }
        }
    ]
}
```

</details>

<details>
  <summary>PATCH /api/v1/taskList/task/update - Endpoint responsável por atualizar a tarefa do usuário</summary>

<br>

> A API utiliza um middleware que verifica o token JWT fornecido na requisição. Se o token for válido, ele é decodificado para extrair os dados do usuário. Com essas informações conseguimos obter e atualizar as tarefas vinculadas ao usuário.

#### **Parâmetros da Requisição**

| **Tipo** | **Parâmetro**   | **Descrição**              | **Obrigatório** |
| -------- | --------------- | -------------------------- | --------------- |
| headers  | `authorization` | Token de acesso            | Sim             |
| body     | `cod_task`      | Código da tarefa           | Sim             |
| body     | `title`         | Título da tarefa           | Não             |
| body     | `description`   | Descrição da tarefa        | Não             |
| body     | `cod_status`    | Código do status da tarefa | Não             |

#### **Respostas da Requisição**

| **Código** | **Status**   | **Descrição**                                  |
| ---------- | ------------ | ---------------------------------------------- |
| 200        | Ok           | O usuário logou com sucesso                    |
| 400        | Bad Request  | Houve um erro ao atualizar a tarefa do usuário |
| 401        | Unauthorized | O token de acesso é obrigatório.               |
| 403        | Forbidden    | O token de acesso é inválido.                  |
| 404        | Not Found    | A tarefa do usuário não foi encontrada.        |
| 404        | Not Found    | O status não foi encontrado.                   |

</details>
