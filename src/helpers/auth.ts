import jwt from "jsonwebtoken";
import env from "@config/environment";
import { BadRequestError, ForbbidenError } from "@helpers/apiError";
import { IUserPayload } from "@interface/user.interface";
import { IAuthToken } from "@interface/auth.interface";

export function createToken(user: IUserPayload) {
  const secretKey = getSecretKey();

  const options: jwt.SignOptions = {
    expiresIn: "1d",
  };

  const token = jwt.sign(user, secretKey, options);

  return { token } as IAuthToken;
}

export function verifyToken(token: string) {
  const secretKey = getSecretKey();

  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    throw new ForbbidenError("O token de acesso é inválido.");
  }
}

function getSecretKey() {
  const secretKey = env.secret_key;

  if (!secretKey) {
    throw new BadRequestError(
      "A chave secreta não está definida nas variáveis de ambiente."
    );
  }

  return secretKey;
}
