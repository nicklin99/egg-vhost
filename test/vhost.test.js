'use strict';

const mock = require('egg-mock');

describe('test/vhost.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/vhost-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, vhost')
      .expect(200);
  });


  it('should GET v1.test.com', () => {
    return app.httpRequest()
      .get('/')
      .set('Host', 'v1.test.com')
      .expect('v1')
      .expect(200);
  });

  it('should GET v2.test.com/test', () => {
    return app.httpRequest()
      .get('/test')
      .set('Host', 'v2.test.com')
      .expect('v2')
      .expect(200);
  });

  it('should GET v2.test.com/ Fail', () => {
    return app.httpRequest()
      .get('/')
      .set('Host', 'v2.test.com')
      .expect('hi, vhost')
      .expect(200);
  });
});
