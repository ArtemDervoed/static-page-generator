// Allows you to precompile ES6 syntax
require('@babel/register');

global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DEV__ = false;

// Run assets require hooks
require('../webpack/hooks')();

require('./build');
