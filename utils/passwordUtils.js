import bcrypt from "bcryptjs";

/**
 * This function accepts a password and uses the
 * bcrypt hashSync function to hash it
 *
 * @param {string} password The password to be hashed
 * @returns {string} The hashed password
 */
export function hashPassword(password) {
  const hashedPass = bcrypt.hashSync(
    password + process.env.BCRYPT_PASSWORD,
    parseInt(process.env.SALT_ROUNDS)
  );

  return hashedPass;
}

/**
 * This function takes 2 string passwords and
 * compares them using the bcrypt compareSync function
 *
 * @param {string} password The first password
 * @param {string} dbPassword The second password which is the correct one
 * @returns {boolean} True if both passwords match, otherwise False
 */
export function comparePasswords(password, dbPassword) {
  const result = bcrypt.compareSync(
    password + process.env.BCRYPT_PASSWORD,
    dbPassword
  );

  return result;
}
