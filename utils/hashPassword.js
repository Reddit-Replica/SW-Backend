import bcrypt from "bcryptjs";

/**
 * This function accepts a password and hash it
 * with bcrypt.hashSync function
 *
 * @param {string} password Password to be hashed
 * @returns {string} The hashed password
 */
function hashPassord(password) {
  const hashedPass = bcrypt.hashSync(
    password + process.env.BCRYPT_PASSWORD,
    parseInt(process.env.SALT_ROUNDS)
  );

  return hashedPass;
}

export default hashPassord;
