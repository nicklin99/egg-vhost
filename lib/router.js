'use strict';

const KoaRouter = require('koa-router');
const utils = require('egg-core').utils;
/**
 * 注册时候controller转为koa中间件格式，拷贝 egg-core/utils/router.js
 * 但是不支持字符串controller,controller必须是function
 */
module.exports = class Router extends KoaRouter {
  /**
   * Create and register a route.
   * @param {String} path - url path
   * @param {Array} methods - Array of HTTP verbs
   * @param {Array} middlewares -
   * @param {Object} opts -
   * @return {Route} this
   */
  register(path, methods, middlewares, opts) {
    // patch register to support generator function middleware and string controller
    middlewares = Array.isArray(middlewares) ? middlewares : [middlewares];
    middlewares = convertMiddlewares(middlewares, this.app);
    path = Array.isArray(path) ? path : [path];
    path.forEach(p => super.register(p, methods, middlewares, opts));
    return this;
  }

};

function convertMiddlewares(middlewares, app) {
  const controller = middlewares.pop();
  const wrappedController = (ctx, next) => {
    return utils.callFn(controller, [ctx, next], ctx);
  };
  return middlewares.concat([wrappedController]);
}
