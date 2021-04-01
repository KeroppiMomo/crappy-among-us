import crypto = require("crypto");
export function generateToken(bytes: number) {
    return crypto.randomBytes(bytes).toString("hex");
}
