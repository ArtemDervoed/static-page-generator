import path from 'path';
import mkdirp from 'mkdirp';
import Promise from 'bluebird';
import pretty from 'pretty';
import removeEmptyLines from 'remove-blank-lines';
import chalk from 'chalk';
const axios = require('axios');
import _flatten from 'lodash/flatten';

import assets from '../../public/webpack-assets.json';
import routes from '../../src/app-routes';
const { api } = require('../../src/config');
import renderStaticHtml from './renderStaticHtml';
import writeFile from './writeFile';

const STATIC_BUILD_PATH = 'public';

const createBuildFolder = Promise.promisify(mkdirp);

createBuildFolder(path.resolve(process.cwd(), STATIC_BUILD_PATH))
  .then(() =>
    renderStaticHtml(routes, assets)
      .then(pages =>
        pages.map(({ html, name, children }) => {

          const page = writeFile(
            path.resolve(process.cwd(), name !== 'index' ? `${STATIC_BUILD_PATH}/${name}` : `${STATIC_BUILD_PATH}`, 'index.html'),
            pretty(removeEmptyLines(html)),
          );

          const pageChildren = children.map(({ html: _html, name: _name, children: _children }) => {
            const childrenPage =  writeFile(
              path.resolve(process.cwd(), name !== 'index' ? `${STATIC_BUILD_PATH}/${name}/${_name}` : `${STATIC_BUILD_PATH}`, 'index.html'),
              pretty(removeEmptyLines(_html)),
            );

            const innerChildren = _children.map(({ html: _innerHtml, name: _innerName, children: _innerChildren }) => {
              return writeFile(
                path.resolve(process.cwd(), name !== 'index' ? `${STATIC_BUILD_PATH}/${name}/${_name}/${_innerName}` : `${STATIC_BUILD_PATH}`, 'index.html'),
                pretty(removeEmptyLines(_innerHtml)),
              );
            });

            return innerChildren.concat(childrenPage);
          });

          return pageChildren.concat(page);
        })),
  ).then(promises => Promise.all(_flatten(promises)))
  .then(() => {
    console.info(chalk.green('Build successfull!'));
  })
  .catch(err => console.error(err));
