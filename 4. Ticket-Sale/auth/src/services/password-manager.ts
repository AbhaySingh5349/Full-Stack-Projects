import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

// scrypt is "callback" based function, so we convert to "promise" based implementation
const scryptAsync = promisify(scrypt);

export class PasswordManager {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buffer = (await scryptAsync(password, salt, 64)) as Buffer;

    return `${buffer.toString('hex')}.${salt}`;
  }

  static async compare(storedPassword: string, inputPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.');

    const buffer = (await scryptAsync(inputPassword, salt, 64)) as Buffer;

    return hashedPassword === `${buffer.toString('hex')}`;
  }
}
