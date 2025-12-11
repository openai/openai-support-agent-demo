// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// Lightweight wrapper around the vendored bcryptjs build. The dist file is shipped in the repo
// to avoid an extra dependency install in constrained environments.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require("../vendor_bcryptjs.js");

export function comparePin(pin: string, hash: string) {
  return bcrypt.compareSync(pin, hash);
}

export function hashPin(pin: string, rounds = 10) {
  return bcrypt.hashSync(pin, rounds);
}
