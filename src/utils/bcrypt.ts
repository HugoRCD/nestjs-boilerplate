import * as bcrypt from "bcrypt";

export const utils = {
  async hash(ToHash: string) {
    const saltRounds = 10;
    return bcrypt.hash(ToHash, saltRounds);
  },

  deHash(ToDeHash: string, Hash: string) {
    return bcrypt.compare(ToDeHash, Hash);
  },
};
