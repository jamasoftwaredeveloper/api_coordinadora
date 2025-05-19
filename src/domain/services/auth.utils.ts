
import bcrypt from 'bcrypt';

export class AuthUtils {
  /**
   * Número de rondas para el algoritmo de hash
   * Un valor más alto hace que el hash sea más seguro pero también más lento
   */
  private readonly SALT_ROUNDS = 10;

  /**
   * Crea un hash seguro de la contraseña
   * @param plainPassword La contraseña en texto plano para hashear
   * @returns Promesa con la contraseña hasheada
   */
  async hashPassword(plainPassword: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
      return await bcrypt.hash(plainPassword, salt);
    } catch (error) {
      console.error('Error hasheando la contraseña:', error);
      throw new Error('Error al procesar la contraseña');
    }
  }

  /**
   * Verifica si una contraseña en texto plano coincide con un hash
   * @param plainPassword La contraseña en texto plano a verificar
   * @param hashedPassword El hash guardado para comparar
   * @returns Promesa con un booleano indicando si la contraseña es correcta
   */
  async checkPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      console.error('Error verificando la contraseña:', error);
      throw new Error('Error al verificar la contraseña');
    }
  }
}