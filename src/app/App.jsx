
import React from 'react';
import PropTypes from 'prop-types';
import { RouterTransitionGroup } from '_components/ReactTransitionGroup';
import Helmet from 'react-helmet';
import { hot } from 'react-hot-loader';

import config from '../config';
// Import your global styles here
import '_styles/styles.scss';
import 'normalize.css/normalize.css';

const App = ({ route }) => (
  <div>
    <Helmet {...config.app} />
    <RouterTransitionGroup routes={route.routes} timeout={1100} />
  </div>
);

App.propTypes = {
  route: PropTypes.object,
  location: PropTypes.object,
};

export default hot(module)(App);
