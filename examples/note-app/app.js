import Colston from "../../index";
import router from "./routes";
import { logger, requestID } from "./middleware";

const app = new Colston();

let requestCount = 0;

app
  .get("/one", (ctx) => {
    requestCount++;
    return ctx.status(200).text("One");
  })
  .get("/two", ctx => ctx.text("two"))
  .post("/two", (ctx) => {
    requestCount++;
    return ctx.status(200).text("Two");
  })
  .patch("/three", (ctx) => {
    requestCount++;
    return ctx.status(200).text("Three");
  });

app.post("/requestCount", (ctx, next) => {
  /**
   * req.locals can be used to pass
   * data from one middleware to another 
   */
  ctx.locals.requestCount = requestCount;
  next();
}, (ctx, next) => {
  ++ctx.locals.requestCount;
  next();
}, (ctx) => {
  return ctx.status(200).text(ctx.locals.requestCount.toString());
});

app.get("/request-id", requestID, (ctx) => {
  return ctx.status(200).json({
    message: "This will give every request a unique ID and in the header too.",
    requestID: ctx.request.id
  });
});

/**
 * the app.all(...route: Router) mehtod
 * accepts k-numbers of router instance objects
 * where each router instance object are
 * @example
 * 
 * router-1 = new Router().get(path, ...middlewares)
 * router-2 = new Router().post(path, ...niddlewares)
 * ...
 * router-k = new Router().<method>(path, ...middlewares)
 * 
 * app.all(router-1, router-2, ..., router-k)
 */
app.use(logger);
app.all(router);

app.start(8000, function () {
  console.log(`server running on port {8000}`);
});
