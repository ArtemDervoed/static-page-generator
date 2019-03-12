/* eslint-disable */
import path from 'path';
import morgan from 'morgan';
// const proxy = require('http-proxy-middleware');
import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import hpp from 'hpp';
import favicon from 'serve-favicon';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { renderRoutes, matchRoutes } from 'react-router-config';
import { Provider } from 'react-redux';
import { all, fork, join } from 'redux-saga/effects';
import Helmet from 'react-helmet';
import chalk from 'chalk';
import _concat from 'lodash/concat';

import createHistory from 'history/createMemoryHistory';
import getIntialState from './store/getInitialState';
import configureStore from './store';
import renderHtml from './utils/renderHtml';
import routes from './app-routes';
import assets from '../public/webpack-assets';
import { port, api } from './config';

const app = express();

// Use helmet to secure Express with various HTTP headers
app.use(helmet());
// Prevent HTTP parameter pollution.
app.use(hpp());
// Compress all requests
app.use(compression());
// app.use('/api', proxy({ target: api, changeOrigin: true }));

// Use for http request debug (show errors only)
app.use(morgan('dev', { skip: (req, res) => res.statusCode < 400 }));
// app.use(favicon(path.resolve(process.cwd(), 'build/favicon.ico')));

if (!__DEV__) {
  app.use(express.static(path.resolve(process.cwd(), 'public')));
} else {
  /* Run express as webpack dev server */

  const webpack = require('webpack');
  const webpackConfig = require('../tools/webpack/config.babel');
  const compiler = webpack(webpackConfig);

  compiler.apply(new webpack.ProgressPlugin());

  app.use(
    require('webpack-dev-middleware')(compiler, {
      publicPath: webpackConfig.output.publicPath,
      headers: { 'Access-Control-Allow-Origin': '*' },
      hot: true,
      quiet: true, // Turn it on for friendly-errors-webpack-plugin
      noInfo: true,
      stats: 'minimal'
    }),
  );

  app.use(
    require('webpack-hot-middleware')(compiler, {
      log: false, // Turn it off for friendly-errors-webpack-plugin
    }),
  );
}

const getState = async (url, initialState) => {
  /* if is articles */
  // const match = matchPath(url, {
  //   path: '/articles/:id',
  //   exact: true,
  // });
  //
  // if (!_isNil(match)) {
  //   const { params: { id } } = match;
  //   const { articles: { allArticles } } = initialState;
  //   const currentArticle = allArticles.find(({ id: articleId }) => Number(id) === articleId);
  //
  //   return {
  //     ...initialState,
  //     articles: {
  //       ...initialState.articles,
  //       currentArticle,
  //     },
  //   };
  // }

  return initialState;
};

// Register server-side rendering middleware
app.get('*', (req, res) => {
  const history = createHistory();
  (async () => {
    try {
      const initialState = await getIntialState(req.cookies, req.path);
      const state = await getState(req.url, initialState);
      const store = configureStore(history, state);

      const staticContext = {};
      const AppComponent = (
        <Provider store={store}>
          {/* Setup React-Router server-side rendering */}
          <StaticRouter location={req.path} context={staticContext}>
            {renderRoutes(routes)}
          </StaticRouter>
        </Provider>
      );

      // Check if the render result contains a redirect, if so we need to set
      // the specific status and redirect header and end the response
      if (staticContext.url) {
        res.status(301).setHeader('Location', staticContext.url);
        res.end();

        return;
      }

      const head = Helmet.renderStatic();
      const htmlContent = renderToString(AppComponent);
      // const initialState = store.getState();

      // Check page status
      const status = staticContext.status === '404' ? 404 : 200;

      // Pass the route and initial state into html template
      // console.log(res);

      res
        .status(status)
        .send(
          renderHtml(
            head,
            assets,
            htmlContent,
            state,
          ),
        );
    } catch (err) {
      const initialState = await getIntialState(req.path);
      const state = await getState(req.url, initialState);
      const store = configureStore(history, state);

      const staticContext = {};
      const AppComponent = (
        <Provider store={store}>
          {/* Setup React-Router server-side rendering */}
          <StaticRouter location={req.path} context={staticContext}>
            {renderRoutes(routes)}
          </StaticRouter>
        </Provider>
      );

      const head = Helmet.renderStatic();
      const htmlContent = renderToString(AppComponent);

      // Check page status
      const status = staticContext.status === 404 ? 404 : 200;

      res
        .status(status)
        .send(
          renderHtml(
            head,
            assets,
            htmlContent,
            store.getState(),
          ),
        );
      console.error(chalk.red(`==> 😭  Rendering routes error: ${err}`));
    }
  })();
});

if (port) {
  app.listen(port, (err) => {
    const url = `http://localhost:${port}`;

    if (err) console.error(`==> 😭  OMG!!! ${err}`);

    console.info(chalk.green(`==> 🌎  Listening at ${url}`));

    /* open browser
    require('../tools/openBrowser')(url);
    */
  });
} else {
  console.error(chalk.red('==> 😭  OMG!!! No PORT environment variable has been specified'));
}
