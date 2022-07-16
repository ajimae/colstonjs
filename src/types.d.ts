import { Errorlike, Server } from "bun";
import _Context from "./context";
declare global {
    interface Request {
        query: Record<string, string>;
        params: Record<string, string>;
        body: object | string;
    }
}
export declare type Options = {
    env?: string;
    port?: number;
    hostname?: string;
};

export type MethodType =
    | 'GET'
    | 'HEAD'
    | 'POST'
    | 'PUT'
    | 'PATCH'
    | 'DELETE'
    | 'CONNECT'
    | 'OPTIONS'
    | 'TRACE'

export declare type Context = _Context;
export declare type Next = () => Promise<void> | void;
export declare type Middleware = (context: Context, next: Next ) => Response | void | Promise<Response | void>;
/**
 * @class Jade
 * @description add route to routeTable, match and process request
 * @method use
 * @method fetch
 */
export interface IColston {
    readonly options: Options;
    readonly routeTable: object;
    readonly middleware: Array<Function>;
    readonly cache: Map<string, any>;
    
    /**
     * @description internal error handler
     * @param error
     * @returns response
     */
    error(error: Errorlike): Response | undefined | Promise<Response | undefined>;
    /**
     *
     * @param key
     * @param value
     */
    set(key: string, value: any): void;
    /**
     *
     * @param {string} key
     * @return {boolean} true | false
     */
    has(key: string): boolean;
    /**
     * @description overloaded get method
     * @param path
     * @returns void
     */

    get(path: string): number
    get(path: string): string;
    get(path: string, ...cb: Array<Middleware>): IColston;
    /**
     * @description HTTP POST method
     * @param path
     * @param cb
     * @returns {this}
     */
    post(path: string, ...cb: Array<Middleware>): IColston;
    /**
     * @description HTTP PATCH method
     * @param path
     * @param cb
     * @returns {this}
     */
    patch(path: string, ...cb: Array<Middleware>): IColston;
    /**
     * @description HTTP PUT method
     * @param path
     * @param cb
     * @returns {this}
     */
    put(path: string, ...cb: Array<Middleware>): IColston;
    /**
     *
     */
    delete(path: string, ...cb: Array<Middleware>): IColston;
    /**
     * @description add level route
     * @param {string} path
     * @param {Function} handler
     */
    use(...cb: Array<(ctx: Context) => Response | Promise<Response> | void>): void;
    /**
     * @description bun fetch function
     * @param {Request} request bun request object
     * @returns {Response} bun response object
     */
    fetch(request: Request): Promise<Response | void>;
    /**
     * @description bun http server entry point
     * @returns bun server instance
     */
    start(port?: number, cb?: Function): Server;
}