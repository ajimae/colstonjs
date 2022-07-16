import Colston from "../bun/dist";

const app = new Colston({ env: "development" });

app.get("/", (ctx) => {
  return ctx.text("OK");
});

app.start(8000)