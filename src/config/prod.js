const _ = require('lodash/fp');

const defaultConfig = require('./default');

module.exports = _.merge(defaultConfig, {
  port: process.env.PORT,
  defaultLocale: 'en',
  api: 'https://geronimo.be',
  // Over write default settings here...
});
