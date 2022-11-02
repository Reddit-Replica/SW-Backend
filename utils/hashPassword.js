import bcrypt from "bcryptjs";

// Document this function [TODO]
export default function hashPassword(password) {
  const hashedPass = bcrypt.hashSync(
    password + process.env.BCRYPT_PASSWORD,
    parseInt(process.env.SALT_ROUNDS)
  );

  return hashedPass;
}
