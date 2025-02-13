// define a base class so instanceof can point to it rather
// than multiple if statements for each custom error
export class BaseServerError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

//throw these errors in your server api
export class BadRequestError extends BaseServerError {
  constructor(message = "The server recieved bad/malformed values") {
    super(message, 400);
  }
}

export class UnauthorizedError extends BaseServerError {
  constructor(message = "The server recieved bad credentials") {
    super(message, 401);
  }
}

export class ForbiddenError extends BaseServerError {
  constructor(message = "The owner did not allow you access to this resource") {
    super(message, 403);
  }
}

export class NotFoundError extends BaseServerError {
  constructor(message = "the specified resource was not found") {
    super(message, 404);
  }
}

export class InternalError extends BaseServerError {
  constructor(message = "the server faced unexpected difficulties") {
    super(message, 500);
  }
}
