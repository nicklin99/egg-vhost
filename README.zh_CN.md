# egg-vhost

一个app多个host

## 依赖说明

### 依赖的 egg 版本 2.0

| egg-vhost 版本 | egg 2.x |
| -------------- | ------- |
| 1.0            | 😁      |

### 依赖的插件

## 安装

```bash
git clone https://github.com/nicklin99/egg-vhost.git
npm install
npm run test-local
```

## 开启插件

默认host域名  test.com
```js
// config/plugin.js
exports.vhost = {
  enable: true,
  package: 'egg-vhost',
};
```

## 使用场景

app/router.js

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


## 单元测试

`npm run test-local`

## 提问交流

请到 [egg issues](https://github.com/nicklin99/egg-vhost/issues) 异步交流。

## License

[MIT](LICENSE)
