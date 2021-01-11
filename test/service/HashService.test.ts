import { expect } from 'chai';
import * as HashService from '../../src/service/HashService';

describe('HashService tests', () => {
  let salt: string;
  const plainTextPassword = 'password';
  let hashedPassword: string;

  it('should salt not be empty', () => {
    salt = HashService.generateSalt();
    expect(salt).to.not.be.empty;
  });

  it('should hashed password not be empty', () => {
    hashedPassword = HashService.hash(plainTextPassword, salt);
    expect(hashedPassword).to.not.be.empty;
  });

  it('should hashed passwords be equal', () => {
    const equalPasswords = HashService.compare(
      plainTextPassword,
      hashedPassword,
      salt,
    );
    expect(equalPasswords).to.be.true;
  });
});
