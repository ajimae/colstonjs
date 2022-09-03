import { Errorlike, Serve, Server } from "bun";
import type { Middleware, Options, IColston } from "./types.d";
import parse from "./params";
import queryParse from "./query";
import readBody from "./body";
import Context from "./context";
import routeRegister from "./routeRegister";
import compose from "./middlewares";
import Router from "./router";

/**
 * @class Colston
 * @description add route to routeTable, match and process request
 * @method use
 * @method fetch
 */
export default class Colston implements IColston {
  readonly options: Options = {};
  readonly routeTable: Array<object> = [];
  readonly middleware: Array<Function> = [];
  readonly cache = new Map<string, any>();

  /**
   * @description overloaded constructor
   * @param {object} options
   */
  constructor(options?: Options) {
    this.options = options;
  }

  /**
   * @description internal error handler
   * @param error
   * @returns response
   */
  public error(error: Errorlike): Response | undefined | Promise<Response | undefined> {
    console.error(error);
    const err = JSON.stringify(error);
    return new Response(JSON.stringify(
      new Error(error.message || "An error occurred\n\r" + err)
    ), { status: 500 });
  }

  /**
   * 
   * @param key 
   * @param value 
   */
  public set(key: string, value: any): void {
    this.cache.set(key, value)
  }

  /**
   * 
   * @param {string} key
   * @return {boolean} true | false
   */
  public has(key: string): boolean {
    return this.cache.has(key);
  }

  /**
   * @description overloaded get method
   * @param path
   * @returns void
   */
  public get(key: string): number
  public get(key: string): string;
  public get(path: string, ...cb: Array<Middleware>): Colston;
  public get(path: string, ...cb: Array<Middleware>): any {
    if (!cb.length)
      return this.cache.get(path);
    routeRegister(path, "GET", cb, this.routeTable);
    return this;
  }

  /**
   * @description HTTP POST method
   * @param path 
   * @param cb 
   * @returns {this} 
   */
  public post(path: string, ...cb: Array<Middleware>): Colston {
    routeRegister(path, "POST", cb, this.routeTable);
    return this;
  }

  /**
   * @description HTTP PATCH method
   * @param path 
   * @param cb 
   * @returns {this} 
   */
  public patch(path: string, ...cb: Array<Middleware>): Colston {
    routeRegister(path, "PATCH", cb, this.routeTable);
    return this;
  }

  /**
   * @description HTTP PUT method
   * @param path 
   * @param cb 
   * @returns {this} 
   */
  public put(path: string, ...cb: Array<Middleware>): Colston {
    routeRegister(path, "PUT", cb, this.routeTable);
    return this;
  }

  /**
   * @description HTTP DELETE method
   * @param path 
   * @param cb 
   * @returns {this} 
   */
  public delete(path: string, ...cb: Array<Middleware>): Colston {
    routeRegister(path, "DELETE", cb, this.routeTable);
    return this;
  }

  /**
   * @description add level route 
   * @param {Array<Function>} callbacks
   */
  public use(...cb: Array<(ctx: Context) => Response | Promise<Response> | void>): void {
    this.middleware.push(...cb);
  }

  public all(...routes: Array<Router>): Colston {
    for (let i = 0; i < routes.length; i++)
      this.routeTable.push(...routes[i].routeTable);

    return this;
  }

  /**
   * @description bun fetch function
   * @param {Request} request bun request object
   * @returns {Response} bun response object
   */
  async fetch(request: Request): Promise<Response> {
    // https://github.com/oven-sh/bun/issues/677
    if (!request.method) request.verb = 'DELETE';
    const context = new Context(request);
    /**
     * invoke all app level middlewares
     */
    this.middleware.forEach((cb, _) => {
      if (typeof cb == "function") cb(context);
    });

    let exists: boolean = false;
    let routes: Array<Array<string>> = [];

    const idx = this.routeTable.findIndex(v => (Object.keys(v)[0]) == "/")
    if (idx > -1) this.routeTable.push(this.routeTable.splice(idx, 1)[0]);

    routes = this.routeTable.map(v => Object.keys(v));

    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];
      let parsedRoute = parse(route[0]);

      if (
        new RegExp(parsedRoute).test(request.url) &&
        this.routeTable[i][route[0]]?.[request.method.toLowerCase() || request.verb.toLowerCase()]
      ) {
        const middleware = this.routeTable[i][route[0]][request.method.toLowerCase() || request.verb.toLowerCase()];
        const m = request.url.match(new RegExp(parsedRoute));

        const _middleware = middleware.slice();
        const cb = _middleware.pop();

        request.params = m.groups;
        request.query = queryParse(request.url);
        request.body = readBody(request);

        exists = true;
        compose(context, _middleware);

        return cb(context) as Response;
      }
    }

    if (!exists) {
      return Response.json({
        status: 404,
        statusText: "Not Found"
      }, { status: 404, statusText: "Not Found" });
    }
  }

  /**
   * @description bun http server entry point
   * @returns bun server instance
   */
  public start(port?: number, cb?: Function): Server {
    const self = this;
    if (typeof cb == "function") cb(this);
    return Bun.serve({
      fetch: self.fetch.bind(self),
      port: port || self.options?.port,
      development: self.options?.env == "development",
      hostname: self.options?.hostname,
      error: self.error
    } as Serve);
  }
}
