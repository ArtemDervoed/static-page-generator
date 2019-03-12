import React from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import isVisible from './utils/isVisible';
import { timeoutsShape, classNamesShape } from './utils/propTypes';

const ReactTransitionGroup = ({
  transitionKey,
  classNames,
  timeout,
  children,
}) => (
  <TransitionGroup component={null}>
    <CSSTransition
      key={transitionKey}
      classNames={classNames}
      timeout={timeout}
    >
      {status => (
        React.cloneElement(children, {
          transitionStatus: status,
          isVisible: isVisible(status),
        })
      )}
    </CSSTransition>
  </TransitionGroup>
);

ReactTransitionGroup.propTypes = {
  transitionKey: PropTypes.any.isRequired,
  timeout: timeoutsShape,
  classNames: classNamesShape,
  children: PropTypes.element.isRequired,
};

ReactTransitionGroup.defaultProps = {
  classNames: 'reactTransitionGroup',
};

export default ReactTransitionGroup;
