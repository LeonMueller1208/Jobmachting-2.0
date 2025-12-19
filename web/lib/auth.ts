import bcrypt from "bcryptjs";

/**
 * Hashes a plain text password using bcrypt
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Compares a plain text password with a hashed password
 * @param password - Plain text password
 * @param hash - Hashed password from database
 * @returns True if passwords match, false otherwise
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

/**
 * Validates password strength
 * @param password - Password to validate
 * @returns Object with isValid flag and error message if invalid
 */
export function validatePassword(password: string): { isValid: boolean; error?: string } {
  if (!password) {
    return { isValid: false, error: "Passwort ist erforderlich" };
  }
  
  if (password.length < 8) {
    return { isValid: false, error: "Passwort muss mindestens 8 Zeichen lang sein" };
  }
  
  return { isValid: true };
}

