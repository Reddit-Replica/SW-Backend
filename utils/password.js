import bcrypt from "bcryptjs";

// Document this function [TODO]
function hashPassword(password) {
  const hashedPass = bcrypt.hashSync(
    password + process.env.BCRYPT_PASSWORD,
    parseInt(process.env.SALT_ROUNDS)
  );

  return hashedPass;
}

function comparePasswords(password, dbPassword) {
  const result = bcrypt.compareSync(
    password + process.env.BCRYPT_PASSWORD,
    dbPassword
  );

  return result;
}

export default {
  hashPassword,
  comparePasswords,
};
