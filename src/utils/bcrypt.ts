import * as bcrypt from "bcrypt";

export const utils = {
  async encrypt(ToHash: string) {
    const saltRounds = 10;
    return bcrypt.hash(ToHash, saltRounds);
  },

  decrypt(ToDeHash: string, Hash: string) {
    return bcrypt.compare(ToDeHash, Hash);
  },
};