import * as bcrypt from "bcryptjs";

export const utils = {
  async encrypt(ToHash: string) {
    const saltRounds = 10;
    return bcrypt.hash(ToHash, saltRounds);
  },

  async decrypt(ToDeHash: string, Hash: string) {
    return bcrypt.compare(ToDeHash, Hash);
  },
};
