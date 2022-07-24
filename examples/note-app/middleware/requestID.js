import crypto from "crypto"; // built into bun

export const requestID = (ctx) => {
  ctx.request.id = crypto.randomBytes(18).toString('hex');
  ctx.setHeader('request-id', ctx.request.id);
}
