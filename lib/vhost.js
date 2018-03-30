'use strict';
const Router = require('./router');
const loader = require('./loader');
const assert = require('assert');
/**
 * vhost
 * map a host to one site or module or section
 */
module.exports = class Vhost {

  constructor(app, host) {
    this.hosts = new Map();
    // 默认host
    this.app_host = host;
    this.app = app;
    this.app.beforeStart(() => {
      this.use_middleware();
    });
  }

  /**
   * 多站点
   *
   * @example site host
   *
   * 域名
   * 泛解析 *.domain.com
   * @example api host
   * const router = new Router();
   * app.vhost.host('api',[],router);
   *
   * @param {object} vhost object {path:'',host:''}
   * @param {Array} middlewares 默认[]
   * @param {router} router 子路由
   */
  host(vhost, middlewares, router) {
    const default_path = '/';
    let app_middlewares;

    if (middlewares instanceof Router) {
      router = middlewares;
      middlewares = [];
    }

    if (vhost instanceof Router) {
      this.app.logger.info('Router is frist arg', vhost);
      router = vhost;
      vhost = router.opts;
    }

    // custome middleware
    if (typeof middlewares === 'function') {
      app_middlewares = middlewares();
    } else {
      app_middlewares = middlewares || [];
    }

    // koa-router
    if (router) {
      const path = router.opts.prefix || default_path;
      vhost.path = path;
      app_middlewares = router.middleware();
    }

    this.app.logger.info('vhost', vhost);
    if (typeof vhost === 'object') {
      this.on_handle_register(vhost, app_middlewares);
    } else {
      this.on_handle_register({
        host: vhost,
        path: default_path,
      }, app_middlewares);
    }
  }

  /**
   * 注册 vhost
   * @param {object} vhost 客户端配置信息 {path:'',host:''} or Map
   * @param {array} middlewares vhost全局中间件
   */
  on_handle_register(vhost, middlewares) {
    if (vhost instanceof Map || Array.isArray(vhost)) {
      vhost.forEach(item => {
        this.registered_vhost(item, middlewares);
      });
    } else {
      this.registered_vhost(vhost, middlewares);
    }
  }

  registered_vhost(vhost, middlewares) {
    const default_path = '/';

    assert(typeof vhost === 'object', 'client 只支持对象' + JSON.stringify(vhost));

    const base_path = vhost.path;
    const base_host = vhost.host;

    const path = base_path || default_path;
    const host = this.fix_app_host(base_host);
    const root = host + path;
    // save
    this.hosts.set(root, {
      path,
      host,
      root,
      middlewares,
    });
  }

  // add vhost middleware find matched vhost from hosts map
  use_middleware() {
    const handleVhost = async (ctx, next) => {
      // hostname:port:path
      const ctx_path = this.fix_app_host(ctx.host) + ctx.path;

      this.app.logger.info('ctx vhost', ctx_path);
      this.app.logger.info('vhosts', this.hosts);

      let current_vhost;

      // es6 for of get
      for (const [root, site] of this.hosts) {
        // es6 startWith get
        if (ctx_path.startsWith(root)) {
          current_vhost = this.hosts.get(root);
          break;
        }
      }

      this.app.logger.info('vhost map result', current_vhost);

      if (current_vhost && current_vhost.middlewares) {
        return await current_vhost.middlewares.call(this.app, ctx, next);
      }

      return await next();
    };

    // add handleVhost middleware
    this.app.use(handleVhost);
  }

  get_new_router(options) {
    if (options.host) {
      loader(options.host, this.app);
    }
    return new Router(options);
  }

  is_test() {
    return this.app.config.env === 'unittest';
  }

  is_local() {
    return this.app.config.env === 'local';
  }

  // if host=api return  api.domain.com
  // if host = api.domain.com return api.domain.com
  fix_app_host(host) {
    // for test
    if (this.is_test()) {
      return host.indexOf('.') !== -1 ? host : host + '.' + this.app_host;
    }

    // dev host 127.0.0.1 return ''
    if (this.is_local()) {
      return '';
    }

    if (host.indexOf('.') === -1) {
      return host + '.' + this.app_host;
    }
    return host;
  }

};
