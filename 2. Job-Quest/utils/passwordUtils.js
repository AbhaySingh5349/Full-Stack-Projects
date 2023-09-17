import bcrypt from "bcryptjs";

const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, bcrypt.genSaltSync(8));
  return hashedPassword;
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export { hashPassword, comparePassword };
