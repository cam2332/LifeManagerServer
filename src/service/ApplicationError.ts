import { Response } from 'express';

export default class ApplicationError extends Error {
  public static BAD_REQUEST = { message: 'BAD_REQUEST', code: 400 };
  public static NOT_FOUND = { message: 'NOT_FOUND', code: 404 };
  public static FORBIDDEN = { message: 'FORBIDDEN', code: 403 };
  public static UNAUTHORIZED = { message: 'UNAUTHORIZED', code: 401 };
  public static VALIDATION_FAILURE = {
    message: 'VALIDATION_FAILURE',
    code: 406,
  };
  public static METHOD_NOT_ALLOWED = {
    message: 'METHOD_NOT_ALLOWED',
    code: 405,
  };
  public static PRECONDITION_FAILED = {
    message: 'PRECONDITION_FAILED',
    code: 412,
  };
  public static CONFLICT = { message: 'CONFLICT', code: 409 };

  public code: number;
  public additionalInfo: string;

  constructor(message: string, code: number, additionalInfo = '') {
    super(message);
    this.name = 'ApplicationError';
    this.code = code;
    this.additionalInfo = additionalInfo;
  }

  public static errorHandler(
    error: ApplicationError,
    response: Response,
  ): void {
    response
      .status(error.code)
      .send({ message: error.message, additionalInfo: error.additionalInfo });
  }
}
