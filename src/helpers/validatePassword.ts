import PasswordValidator from "password-validator";
import { BadRequestError } from "./apiError";

export function validatePassword(password: string) {
  const schema = schemaPassword();

  const list: string[] = [];

  const errors = schema.validate(password, {
    details: true,
  }) as ValidationError[];

  errors.forEach((x) => {
    list.push(messagesError[x.validation]);
  });

  if (errors.length > 0) {
    throw new BadRequestError(JSON.stringify(list));
  }
}

function schemaPassword() {
  const schema = new PasswordValidator();

  schema.is().min(8).has();
  schema.has().uppercase();
  schema.has().lowercase();
  schema.has().digits(1);
  schema.has().symbols(1);
  schema.has().not().spaces();

  return schema;
}

interface ValidationError {
  validation: string;
}

const messagesError: Record<string, string> = {
  min: "A senha deve possuir no mínimo 8 caracteres",
  uppercase: "Deve possuir pelo menos 1 caractere maiúsculo",
  lowercase: "Deve possuir pelo menos 1 caractere minúsculo",
  digits: "Deve possuir pelo menos 1 número",
  symbols: "Deve possuir pelo menos 1 simbolo",
  spaces: "Não deve possuir espaços",
};
