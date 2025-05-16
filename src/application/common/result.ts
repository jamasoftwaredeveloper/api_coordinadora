export class Result<T> {
    private constructor(
      public readonly isError: boolean,
      public readonly data: T | null,
      public readonly message: string = '',
      public readonly statusCode: number = 200
    ) {}
  
    static ok<U>(data: U): Result<U> {
      return new Result<U>(false, data);
    }
  
    static fail<U>(message: string, statusCode = 400): Result<U> {
      return new Result<U>(true, null, message, statusCode);
    }
  }