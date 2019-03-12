
import path from 'path';
import _each from 'lodash/each';
import _values from 'lodash/values';
import _includes from 'lodash/includes';
import _isEmpty from 'lodash/isEmpty';
import _isNil from 'lodash/isNil';
import morgan from 'morgan';
import express from 'express';
import compression from 'compression';
import chalk from 'chalk';
import routes from './routes';
import proxy from 'http-proxy-middleware';
import { port, api } from './config';

// const helmet = require('helmet');
const app = express();

// Compress all requests
app.use(compression());
// app.use(helmet());

// app.use(helmet.contentSecurityPolicy({
//   directives: {
//     defaultSrc: ["'self'", "'unsafe-inline'"],
//     mediaSrc: ["'self'", 'storage.googleapis.com'],
//     imgSrc: ["'self'", 'storage.googleapis.com', 'data:'],
//     scriptSrc: ["'self'", "'unsafe-inline'"],
//   },
// }));

app.use('/api', proxy({ target: api, changeOrigin: true }));
app.use('/system', proxy({ target: api, changeOrigin: true }));

// Use for http request debug (show errors only)
app.use(morgan('dev', { skip: (req, res) => res.statusCode < 400 }));

app.use(express.static(path.resolve(process.cwd(), 'public')));

_each(routes, ({ path: routePath }) => {
  app.get(routePath, (req, res) => {
    if (_includes(routes, req.path)) {
      const paramsValues = _values(req.params).filter(value => !_isNil(value));
      const routeWithoutParams = req
        .path.split('/')
        .filter(part => !_isEmpty(part))
        .filter(part => !_includes(paramsValues, part)).join('/');

      const paramsRoute = _isEmpty(paramsValues) ? '' : `/${paramsValues.join('/')}`;
      res.sendFile(`${path.resolve('./public')}/${routeWithoutParams}${paramsRoute}.html`);
    } else {
      res.status = 404;
      res.sendFile(`${path.resolve('./public')}/404/index.html`);
    }
  });
});


if (port) {
  app.listen(port, (err) => {
    const url = `http://localhost:${port}`;

    if (err) {
      console.error(`==> 😭  OMG!!! ${err}`);
    }

    console.info(chalk.green(`==> 🌎  Listening at ${url}`));
  });
} else {
  console.error(chalk.red('==> 😭  OMG!!! No PORT environment variable has been specified'));
}
