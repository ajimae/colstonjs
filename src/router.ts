import type { Middleware } from "./types.d";
import routeRegister from "./routeRegister";

export default class Router {
  routeTable: Array<object> = [];
  // constructor(routeTable?: RouteTable) {
  //   this.routeTable = routeTable;
  // }

  /**
   * @description register HTTP GET method
   * @param path
   * @returns void
   */
  public get(path: string, ...cb: Array<Middleware>): any {
    routeRegister(path, "GET", cb, this.routeTable);
  }

  /**
   * @description register HTTP POST method
   * @param path 
   * @param cb 
   * @returns {this} 
   */
  public post(path: string, ...cb: Array<Middleware>): void {
    routeRegister(path, "POST", cb, this.routeTable);
  }

  /**
   * @description register HTTP PATCH method
   * @param path 
   * @param cb 
   * @returns {this} 
   */
  public patch(path: string, ...cb: Array<Middleware>): void {
    routeRegister(path, "PATCH", cb, this.routeTable);
  }

  /**
   * @description register HTTP PUT method
   * @param path 
   * @param cb 
   * @returns {this} 
   */
  public put(path: string, ...cb: Array<Middleware>): void {
    routeRegister(path, "PUT", cb, this.routeTable);
  }

  /**
   * @description register HTTP DELETE method
   * @param path 
   * @param cb 
   * @returns {this} 
   */
  public delete(path: string, ...cb: Array<Middleware>): void {
    routeRegister(path, "DELETE", cb, this.routeTable);
  }
}
