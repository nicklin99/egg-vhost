'use strict';
const path = require('path');

module.exports = (module, app) => {
  let dirs = app.loader.getLoadUnits().map(unit => path.join(unit.path, 'app', module, 'middleware'));

  if (!app[module]) {
    app[module] = {};
  }

  app[module].middleware = app[module].middleware || {};

  new app.loader.FileLoader({
    directory: dirs,
    target: app[module].middleware,
    inject: app,
  }).load();

  dirs = app.loader.getLoadUnits().map(unit => path.join(unit.path, 'app', module, 'controller'));

  app[module].controller = app[module].controller || {};

  app.loader.loadController({
    directory: dirs,
    target: app[module].controller,
  });


};
