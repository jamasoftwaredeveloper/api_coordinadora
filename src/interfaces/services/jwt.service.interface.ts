export interface JwtPayload {
  id: number;
  email: string;
}

export interface JwtService {
  generate(payload: JwtPayload): string;
  verify(token: string): JwtPayload | null;
}
