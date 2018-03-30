'use strict';

module.exports = app => {
  const {
    router,
    controller
  } = app;

  router.get('/', controller.home.index);

  const v1_router = app.vhost.get_new_router({
    host: 'v1',
    prefix: '',
  });
  v1_router.get('/', app.v1.controller.index.index);
  app.vhost.host(v1_router);

  const v2_router = app.vhost.get_new_router({
    host: 'v2',
    prefix: '/test',
  });
  v2_router.get('/', app.v2.controller.index.index);
  app.vhost.host(v2_router);
};
