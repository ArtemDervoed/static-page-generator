import React from 'react';
import PropTypes from 'prop-types';
import { renderRoutes } from 'react-router-config';
import { Switch, withRouter } from 'react-router-dom';
// import { TransitionGroup, CSSTransition } from 'react-transition-group';

// import isVisible from './utils/isVisible';
// import { timeoutsShape } from './utils/propTypes';

class RouterWithDelay extends React.PureComponent {
  render() {
    const { routes, location } = this.props;
    return (
      <Switch location={location} key={location.pathname}>
        {renderRoutes(routes)}
      </Switch>
    );
  }
}

RouterWithDelay.propTypes = {
  location: PropTypes.object,
  routes: PropTypes.array,
  // timeout: timeoutsShape,
};

export default withRouter(RouterWithDelay);
