import validator from "validator";
import { BadRequestError } from "@helpers/apiError";

export function validateEmail(email: string) {
  if (!validator.isEmail(email)) {
    throw new BadRequestError("Email Inválido.");
  }
}
