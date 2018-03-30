# egg-vhost

1个app多个host

## Install

git clone 

```bash
$ npm i egg-vhost --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.vhost = {
  enable: true,
  package: 'egg-vhost',
};
```

## Configuration

host 默认host域名  test.com
```js
// {app_root}/config/config.default.js
exports.vhost = {
  host:''
};
```

see [config/config.default.js](config/config.default.js) for more detail.

## Example

```javascript
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
```

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## License

[MIT](LICENSE)
