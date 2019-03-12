const express = require('express');
const axios = require('axios');
const { api } = require('./src/config');
//
// const _each = require('lodash/each');
// const _values = require('lodash/values');
// const _isEmpty = require('lodash/isEmpty');
// const _includes = require('lodash/includes');
// const _isNil = require('lodash/isNil');

// const compression = require('compression');
// const proxy = require('http-proxy-middleware');
// const path = require('path');

const { spawn } = require('child_process');

// const routes = require('./src/routes');

const app = express();

// const HOST = 'https://geronimo.snpdev.ru';
// const CLOUD_STORAGE_HOST = 'https://geronimo.snpdev.ru';
// const CLOUD_STORAGE_HOST = 'https://storage.googleapis.com/alphabeta-public-files'

/* REMOVE, replace with nginx */
// app.use(compression());
//
// app.use('/api', proxy({ target: HOST, changeOrigin: true }));
// app.use('/uploads', proxy({ target: CLOUD_STORAGE_HOST, changeOrigin: true }));
//
// app.use(express.static(path.join(__dirname, '/public')));
//
// _each(routes, ({ path: routePath }) => {
//   app.get(routePath, (req, res) => {
//     const paramsValues = _values(req.params).filter(value => !_isNil(value));
//     const routeWithoutParams = req
//       .path.split('/')
//       .filter(part => !_isEmpty(part))
//       .filter(part => !_includes(paramsValues, part)).join('/');
//
//     const paramsRoute = _isEmpty(paramsValues) ? '' : `/${paramsValues.join('/')}`;
//     res.sendFile(`${path.resolve('./public')}/${routeWithoutParams}${paramsRoute}.html`);
//   });
// });
/* REMOVE, replace with nginx */

app.post('/build', (req, res) => {
  const build = spawn('yarn', ['build:static']);

  build.stdout.on('data', (data) => {
    console.log(api, 'data');
    console.log(`${data}`);
  });

  build.stderr.on('data', (err) => {
    console.log(`${err}`);
  });

  build.on('close', () => {
    console.log(api, 'close');
    axios.get('http://127.0.0.1/api/v1/update_tasks/finish');
  });

  res.send({
    status: 200,
    message: 'OK',
  });
});

app.listen(process.env.PORT || 3000, (err) => {
  const url = `http://localhost:${process.env.PORT || 3000}`;

  if (err) {
    console.error(err);
  }

  console.info(`Listening at ${url}`);
});
