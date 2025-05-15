export class DatabaseError extends Error {
  public originalError: unknown;

  constructor(message: string, originalError: unknown) {
    super(message);
    this.name = "DatabaseError";
    this.originalError = originalError;
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends Error {
  constructor(resource: string) {
    super(`${resource} not found`);
    this.name = "NotFoundError";
  }
}

export class DuplicateError extends Error {
  constructor(field: string) {
    super(`${field} already exists`);
    this.name = "DuplicateError";
  }
}
