import { methods } from "./methods";
import type { Middleware, MethodType } from "./types.d";

export default function register(path: string, method: MethodType, callback: Array<Middleware>, routeTable: Array<object> = []): void | never {
  routeTable.push({ [path]: validate(path, method, callback) });
}

function validate(path: string, method: MethodType, callback: Array<Middleware>): { [path: string]: Array<Middleware> } {
  if (methods.indexOf(method) === -1) throw new Error("Invalid HTTP method, Accepted methods are: " + methods.join(" "));
  if (path.charAt(0) !== "/") throw new Error("Invalid path, path must start with '/'");

  for (const i in callback)
    if (typeof callback[i] !== "function") throw new Error("Invalid handler function, handler must be a function");

  return { [method.toLowerCase()]: callback };
}
