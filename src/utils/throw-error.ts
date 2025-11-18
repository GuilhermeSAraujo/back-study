export class HttpError extends Error {
  constructor(message: string, public status: number = 400) {
    super(message);
    this.name = "HttpError";
  }
}

export class InternalServerError extends Error {
  constructor(
    public internalMessage: string,
    public userMessage: string = "Erro interno do servidor"
  ) {
    super(internalMessage);
    this.name = "InternalServerError";
  }
}

export function throwError(message: string, status: number = 400) {
  throw new HttpError(message, status);
}
