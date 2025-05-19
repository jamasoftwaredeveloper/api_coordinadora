import {
  JwtService,
  JwtPayload,
} from "../../interfaces/services/jwt.service.interface";
import { generateJWT, verifyToken } from "../../utils/jwt"; // Tu función actual

export class JwtServiceImpl implements JwtService {
  generate(payload: JwtPayload): string {
    return generateJWT(payload);
  }

  verify(token: string): JwtPayload | null {
    const payload = verifyToken(token);
    if (payload && payload.id && payload.email) {
      return payload as JwtPayload;
    }
    return null;
  }
}
