# 🍥 Colston.js

Fast, lightweight and zero dependency framework for [bunjs](https://bun.sh) 🚀

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/ajimae/colstonjs/publish?style=plastic) ![npm](https://img.shields.io/npm/v/colstonjs?color=blue&style=plastic)
![GitHub](https://img.shields.io/github/license/ajimae/colstonjs?style=plastic)
![npm](https://img.shields.io/npm/dt/colstonjs?style=plastic)

## Table of Contents

- [🍥 Colston.js](#-colstonjs)
  - [Table of Contents](#table-of-contents)
  - [Background](#background)
  - [Prerequisite](#prerequisite)
  - [Installation](#installation)
      - [_NOTE_](#note)
  - [Usage](#usage)
    - [_NOTE_](#note-1)
    - [Examples](#examples)
      - [Hello Bun](#hello-bun)
      - [Read request body as `json` or `text`](#read-request-body-as-json-or-text)
      - [Using named parameters](#using-named-parameters)
      - [Using query parameters](#using-query-parameters)
      - [Method chaining](#method-chaining)
      - [Running the demo `note-app`](#running-the-demo-note-app)
    - [Middleware](#middleware)
      - [Application-level middleware](#application-level-middleware)
      - [Route-level middleware](#route-level-middleware)
      - [Context locals](#context-locals)
    - [Router](#router)
      - [Instantiating Router class](#instantiating-router-class)
      - [Injecting Router instance into the app](#injecting-router-instance-into-the-app)
  - [Application instance cache](#application-instance-cache)
  - [Error handler](#error-handler)
  - [Benchmark](#benchmark)
    - [Benchmarking was performed using k6 load testing library.](#benchmarking-was-performed-using-k6-load-testing-library)
  - [Contribute](#contribute)
  - [License](#license)
  - [Todo](#todo)
  - [Author](#author)
  - [DevNote:](#devnote)

## Background

Bun is the lastest and arguably the fastest runtime environment for javascript, similar to node and deno. Bun uses JSC (JavaScriptCore) engine unlike node and 
deno which is the part of the reason why it's faster than node and deno.

Bun is written in a low-level manual memory management programming language called [ZIG](https://ziglang.org).

Bun supports ~90% of the native nodejs APIs including `fs`, `path`etc and also distribute it's packages using [npm](https://npmjs.com) hence both `yarn` and `npm` are supported in bun.

Colstonjs is a fast, minimal and higly configurable typescript based api `framework` highly inspired by [_Expressjs_](https://expressjs.com) and [_fastify_](https://www.fastify.io) for building high performance APIs, colstonjs is completely built on bunjs.

## Prerequisite
🐎 *Bun* - Bun needs to be installed locally on your development machine.


## Installation

💻  To install bun head over to the [offical website](https://bun.sh) and follow the installation instructions.

🧑‍💻  To install coltsonjs run 

```bash
$ bun add colstonjs
```
#### _NOTE_
_Although colstonjs is distributed under npm, colstonjs is only available for bun, node and deno are not currently supported._

## Usage

Importing the colstonjs into the application

```typescript
import Colston from "colstonjs";

// initializing Colston 
const serverOptions = {
  port: 8000,
  env: "development"
};

// initialize app with server options
const app: Colston = new Colston(serverOptions);
```

A simple get request

```typescript
// server.ts
...
app.get("/", function(ctx) {
  return ctx.status(200).text("OK"); // OK
});
...
```

To allow the application to accept requests, we have to call the `start()` method with an optional
port and/or callback function.

This will start an `http` sever on the listening on all interfaces (`0.0.0.0`) listening on the specified port.

```typescript
// server.ts
...
server.start(port?, cb?);
```

### _NOTE_
* _`port` number can be passed into the `app` through the server options or the as the first argument of the `start()` mthod. If the the port number is passed as part of the server options and also in the `start()` mthod, then port number passed into to the `start()` takes priority. If no neither is provided, then the app will default to port `3000`_

* _`callback` method is immediately invoked once the connection is successfully established and the application is ready to accept requests._

### Examples

#### Hello Bun

```typescript
// server.ts
import Colston, { type Context } from "colstonjs";

const app: Colston = new Colston({ env: "development" });

app.set("port", 8000);

app.get("/", (ctx: Context) => {
  return ctx.status(200).json({ message: "Hello World!" });
});

// start the server 
app.start(app.get('port'), () => console.log(`server listening on port ${app.get("port")}`));
```

#### Read request body as `json` or `text`

```typescript
// server.ts
import Colston, { type Context } from "colstonjs";

const app: Colston = new Colston({ env: "development" });

app.get("/", async (ctx: Context) => {
  const body = await ctx.request.json();
  const body2 = await ctx.request.text();

  return ctx.status(200).json({ body, body2 });
});

app.start(8000);
```

#### Using named parameters


```typescript
// server.ts
import Colston, { type Context } from "colstonjs";

const app: Colston = new Colston({ env: "development" });

app.get("/user/:id/name/:name", async (ctx: Context) => {
  const user = ctx.request.params;

  // make an api call to a backend datastore a to retrieve usre details
  const userDetails = await getUserDetails(details.id); // e.g: { id: 12345, name: "jane"}

  return ctx.status(200).json({ user: userDetails});
});

app.start(8000);
```
#### Using query parameters


```typescript
// server.ts
import Colston, { type Context } from "colstonjs";

const app: Colston = new Colston({ env: "development" });

app.get('/?name&age', async (ctx: Context) => {
  const query = ctx.request.query;

  return ctx.status(200).json(query); // { name: "jane", age: 50 }
});

app.start(8000);
```

#### Method chaining
Colstonjs also provide the flexibility of method chaining, create one app instance and chain all methods on that single instance.
```typescript
// server.ts
import Colston, { type Context } from "colstonjs";

const app: Colston = new Colston({ env: "development" });

app
  .get("/one", (ctx: Context) => {
      return ctx.status(200).text("One");
  })
  .post("/two", (ctx: Context) => {
      return ctx.status(200).text("Two");
  })
  .patch("/three", (ctx: Context) => {
      return ctx.status(200).text("Three");
  });

app.start(8000);
```

#### Running the demo `note-app`
Follow the steps below to run the `demo note-taking api application` in the `examples`directory.
- Clone this repository
- Change directory into the note-app folder by running `cd examples/note-app`
- Start the http server to listen on port `8000` by running `bun app.js`
- User your favourite `http client` (e.g Postman) to make requests to the `listening http server`.

<a href="https://github.com/ajimae/colstonjs/releases/download/v0.1.0-beta.3/postman_collection.json">
  <img src="postman.jpeg" width="120">
</a>

### Middleware  

Colstonjs support both `route` level middleware as well as `app` level middleware.

#### Application-level middleware
This is a middleware which will be called on each request made to the server, one use case can be for logging.
```typescript
// logger.ts
export function logger(ctx) {
  const { pathname } = new URL(ctx.request.url);
  console.info([new Date()], " - - " + ctx.request.method + " " + pathname + " HTTP 1.1" + " - ");
}

// server.ts
import Colston, { type Context } from "colstonjs";
import { logger } from "./logger";

const app: Colston = new Colston({ env: "development" });

// middleware
app.use(logger); // [2022-07-16T01:01:00.327Z] - - GET / HTTP 1.1 - 

app.get("/", (ctx: Context) => {
  return ctx.status(200).text("Hello logs...");
});

app.start(8000);
```

The `.use()` accepts `k` numbers of middleware function.
```typescript
...
app.use(fn-1, fn-2, fn-3, ..., fn-k)
...
```

#### Route-level middleware
Colston on the other hand allows you to add a middleware function in-between the route path and the handler function.

```typescript
// request-id.ts
export function requestID(ctx) {
  ctx.request.id = crypto.randomBytes(18).toString('hex');
}

// server.ts
import crypto from "crypto";
import Colston, { type Context } from "colstonjs";
import { requestID } from "./request-id";

const app: Colston = new Colston({ env: "development" });

app.get("/", requestID, (ctx: Context) => {
  return ctx.status(200).text(`id: ${ctx.request.id}`); // id: 410796b6d64e3dcc1802f290dc2f32155c5b
});

app.start(8000);
```

It is also worthy to note that we can also have `k` numbers of `route-level` middleware functions

```typescript
// server.ts
...
app.get("/", middleware-1, middleware-2, middleware-3, ..., middleware-k, (ctx: Context) => { 
  return ctx.status(200).text(`id: ${ctx.request.id}`);
});
...
```
#### Context locals
`ctx.locals` is a plain javascript object that is specifically added to allow sharing of data amongst the chain of middlewares and/or handler functions.

```ts
// server.ts
...
let requestCount = 0;
app.post("/request-count", (ctx, next) => {
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
  let count = ctx.locals.requestCount;
  return ctx.status(200).text(count); // 1
});
```

### Router
#### Instantiating Router class
Router class provide a way to separate router specific declaration/blocks from the app logic, by providing that extra abstraction layer for your project.
```typescript
// router.ts
import Router from "Router";

// instantiate the router class
const router1 = new Router();
const router2 = new Router();

// define user routes - can be in a separate file or module.
router1.post('/user', (ctx) => { return ctx.status(200).json({ user }) });
router1.get('/users', (ctx) => { return ctx.json({ users }) });
router1.delete('/user?id', (ctx) => { return ctx.status(204).head() });

// define the notes route - can also be in separate module.
router2.get('/note/:id', (ctx) => { return ctx.json({ note }) });
router2.get('/notes', (ctx) => { return ctx.json({ notes }) });
router2.post('/note', (ctx) => { return ctx.status(201).json({ note }) });

export { router1, router2 };
```

#### Injecting Router instance into the app
```typescript
// server.ts
import Colston from "colstonjs";
import { router1, router2 } from "./router";

const app: Colston = new Colston();

app.all(router1, router2);

// other routes can still be defined here
app.get("/", (ctx) => {
  return ctx.status(200).text("Welcome to colstonjs framework for bun");
});

app.start(8000)
```
The `app.all()` method takes in k numbers of router instance objects e.g `app.all(router-1, router-2, ..., router-k);`. The [example](example) folder contains a full note taking backend app that utilizes this pattern.
## Application instance cache
We can cache simple data which will leave throughout the application instance lifecycle.

```typescript
import Colston, { type Context } from "colstonjs";

const app: Colston = new Colston({ env: "development" });

// set properties to cache
app.set("age", 50);
app.set("name", "jane doe");

// check if a key exists in the cache
app.has("age"); // true
app.has("name"); // true

// retrieve the value stored in a given key
app.get("age"); // 50
app.get("name"); // jane doe

app.start(8000);
```
## Error handler
Errors are handled internally by colstonjs, however this `error handler method` can aslo be customised.
```typescript
// index.ts
import Colston, { type Context } from "colstonjs";

const app: Colston = new Colston({ env: "development" });

// a broken route
app.get("/error", (ctx) => {
  throw new Error("This is a broken route");
});

// Custom error handler
app.error = async function (error) {
  console.error("This is an error...");
  return Response.json(JSON.stringify(
    // return custom error here
    const err = JSON.stringify(error);
    new Error(error.message || "An error occurred" + err);
  ), { status: 500 });
}

app.start(8000);
```
## Benchmark
<details><summary>Click to expand</summary>

### Benchmarking was performed using [k6](https://k6.io/open-source) load testing library.

_Colstonjs_

Colsonjs on `bunjs` runtime environment
```ts
import Colston from "colstonjs";

const app = new Colston({ env: "development" });

app.get("/", (ctx) => {
  return ctx.text("OK");
});

app.start(8000)
```

```ts
$ ./k6 run index.js

          /\      |‾‾| /‾‾/   /‾‾/   
     /\  /  \     |  |/  /   /  /    
    /  \/    \    |     (   /   ‾‾\  
   /          \   |  |\  \ |  (‾)  | 
  / __________ \  |__| \__\ \_____/ .io

  execution: local
     script: index.js
     output: -

  scenarios: (100.00%) 1 scenario, 100 max VUs, 40s max duration (incl. graceful stop):
           * default: 100 looping VUs for 10s (gracefulStop: 30s)


running (10.0s), 000/100 VUs, 240267 complete and 0 interrupted iterations
default ✓ [======================================] 100 VUs  10s

     ✓ success

     checks.........................: 100.00% ✓ 240267       ✗ 0     
     data_received..................: 16 MB   1.6 MB/s
     data_sent......................: 19 MB   1.9 MB/s
     http_req_blocked...............: avg=1.42µs  min=0s       med=1µs    max=9.24ms  p(90)=1µs    p(95)=2µs   
     http_req_connecting............: avg=192ns   min=0s       med=0s     max=2.18ms  p(90)=0s     p(95)=0s    
     http_req_duration..............: avg=4.1ms   min=89µs     med=3.71ms max=41.18ms p(90)=5.3ms  p(95)=6.53ms
       { expected_response:true }...: avg=4.1ms   min=89µs     med=3.71ms max=41.18ms p(90)=5.3ms  p(95)=6.53ms
     http_req_failed................: 0.00%   ✓ 0            ✗ 240267
     http_req_receiving.............: avg=24.17µs min=7µs      med=12µs   max=15.01ms p(90)=18µs   p(95)=21µs  
     http_req_sending...............: avg=6.33µs  min=3µs      med=4µs    max=14.78ms p(90)=7µs    p(95)=8µs   
     http_req_tls_handshaking.......: avg=0s      min=0s       med=0s     max=0s      p(90)=0s     p(95)=0s    
     http_req_waiting...............: avg=4.07ms  min=75µs     med=3.69ms max=41.16ms p(90)=5.27ms p(95)=6.48ms
     http_reqs......................: 240267  24011.563111/s
     iteration_duration.............: avg=4.15ms  min=117.88µs med=3.74ms max=41.25ms p(90)=5.37ms p(95)=6.62ms
     iterations.....................: 240267  24011.563111/s
     vus............................: 100     min=100        max=100 
     vus_max........................: 100     min=100        max=100 
```
*Express*

Expressjs on `nodejs` runtime environment
```ts
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("OK");
});

app.listen(8000);
```

```ts
$ ~/k6 run index.js

          /\      |‾‾| /‾‾/   /‾‾/   
     /\  /  \     |  |/  /   /  /    
    /  \/    \    |     (   /   ‾‾\  
   /          \   |  |\  \ |  (‾)  | 
  / __________ \  |__| \__\ \_____/ .io

  execution: local
     script: index.js
     output: -

  scenarios: (100.00%) 1 scenario, 100 max VUs, 40s max duration (incl. graceful stop):
           * default: 100 looping VUs for 10s (gracefulStop: 30s)


running (10.0s), 000/100 VUs, 88314 complete and 0 interrupted iterations
default ✓ [======================================] 100 VUs  10s

     ✓ success

     checks.........................: 100.00% ✓ 88314       ✗ 0    
     data_received..................: 20 MB   2.0 MB/s
     data_sent......................: 7.1 MB  705 kB/s
     http_req_blocked...............: avg=1.54µs  min=0s     med=1µs     max=2.04ms  p(90)=1µs     p(95)=2µs    
     http_req_connecting............: avg=451ns   min=0s     med=0s      max=1.99ms  p(90)=0s      p(95)=0s     
     http_req_duration..............: avg=11.28ms min=1.22ms med=10.04ms max=90.96ms p(90)=15.04ms p(95)=18.71ms
       { expected_response:true }...: avg=11.28ms min=1.22ms med=10.04ms max=90.96ms p(90)=15.04ms p(95)=18.71ms
     http_req_failed................: 0.00%   ✓ 0           ✗ 88314
     http_req_receiving.............: avg=18.18µs min=10µs   med=15µs    max=10.16ms p(90)=22µs    p(95)=25µs   
     http_req_sending...............: avg=6.53µs  min=3µs    med=5µs     max=12.61ms p(90)=8µs     p(95)=9µs    
     http_req_tls_handshaking.......: avg=0s      min=0s     med=0s      max=0s      p(90)=0s      p(95)=0s     
     http_req_waiting...............: avg=11.25ms min=1.2ms  med=10.01ms max=90.93ms p(90)=15ms    p(95)=18.68ms
     http_reqs......................: 88314   8818.015135/s
     iteration_duration.............: avg=11.32ms min=1.25ms med=10.08ms max=91.01ms p(90)=15.08ms p(95)=18.76ms
     iterations.....................: 88314   8818.015135/s
     vus............................: 100     min=100       max=100
     vus_max........................: 100     min=100       max=100
```
From the above results we can see that Colsonjs on bun handles ~ 2.72x number of requests per second when compared with Expressjs on node, benchmarking files can be found in this repository.
</details>

## Contribute
PRs for features, enhancements and bug fixes are welcomed. ✨ You can also look at the [todo](todo.md) file for feature contributions. 🙏🏽

## License

This software is distributed under the [MIT](LICENSE.md) license.

## Todo
See the TODO doc [here](todo.md), feel free to also add to the list by editing the [TODO](todo.md) file.

## Author
Coded with 💙 by [Chukwuemeka Ajima](https://github.com/ajimae) 

## DevNote:
Although this version is fairly stable, it is actively still under development so also is [bunjs](https://bun.sh) and might contain some bugs, hence, not ideal for a production app.
