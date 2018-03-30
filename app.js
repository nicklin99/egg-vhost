'use strict';

const Vhost = require('./lib/vhost');

module.exports = app => {
  // vhost
  if (app.config.vhost) {
    app.vhost = new Vhost(app, app.config.vhost.host);
  }
};
