import crypto from 'crypto';

export const generateSalt = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const hash = (password: string, salt: string): string => {
  const hash = crypto.createHmac('sha512', salt);
  hash.update(password);
  return hash.digest('hex');
};

export const compare = (
  password: string,
  hashedPassword: string,
  salt: string,
): boolean => {
  const generatedPassword = hash(password, salt);
  return generatedPassword === hashedPassword;
};
