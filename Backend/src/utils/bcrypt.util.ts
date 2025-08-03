import { genSalt, hash, compare } from 'bcrypt';

export class BcryptUtil {
  static async hash(raw: string) {
    const salt = await genSalt(10);
    return hash(raw, salt);
  }

  static async compare(raw: string, hashed: string) {
    return compare(raw, hashed);
  }
}
