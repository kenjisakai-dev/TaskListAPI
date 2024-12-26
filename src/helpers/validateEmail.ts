import validator from "validator";
import { BadRequestError } from "./apiError";

export function validateEmail(email: string) {
  if (!validator.isEmail(email)) {
    throw new BadRequestError("Email Inválido.");
  }
}
