import React from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';

import isVisibleComponent from './utils/isVisible';
import { timeoutsShape } from './utils/propTypes';

const ReactTransition = ({
  isVisible,
  timeout,
  unmountOnExit,
  children,
}) => (
  <Transition
    in={isVisible}
    component={null}
    timeout={timeout}
    unmountOnExit={unmountOnExit}
  >
    {status => (
      React.cloneElement(children, {
        transitionStatus: status,
        isVisible: isVisibleComponent(status),
      })
    )}
  </Transition>
);

ReactTransition.propTypes = {
  isVisible: PropTypes.bool,
  timeout: timeoutsShape,
  unmountOnExit: PropTypes.bool,
  children: PropTypes.element.isRequired,
};

ReactTransition.defaultProps = {
  unmountOnExit: false,
};

export default ReactTransition;
