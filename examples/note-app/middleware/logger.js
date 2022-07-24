export const logger = (ctx) => {
  const { pathname } = new URL(ctx.request.url);
  console.info("- - " + [new Date()], "- - " + ctx.request.method + " " + pathname + " HTTP 1.1" + " - ");
}
