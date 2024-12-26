import dotenv from "dotenv";
dotenv.config();

export default {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  secret_key: process.env.SECRET_KEY,
};