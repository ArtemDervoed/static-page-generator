/* eslint-disable*/
import React from 'react';
import CSSModules from 'react-css-modules';
import classnames from 'classnames';
import styles from './Description.css';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import delay from 'lodash/delay';

@CSSModules(styles, { allowMultiple: true })
class Description extends React.PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    subTitle: PropTypes.string,
    delay: PropTypes.number,
    action: PropTypes.string.isRequired,
    hover: PropTypes.bool.isRequired,
    orientation: PropTypes.string.isRequired,
    onTitleShowed: PropTypes.func.isRequired,
  }

  componentWillReceiveProps({ action }) {
    if (action === 'SHOW_TITLE' && this.props.action === '') {
      delay(() => { //eslint-disable-line
        this.props.onTitleShowed();
      }, 1700);
    }
  }

  render() {
    const {
      title,
      subTitle,
      action,
      delay,
      hover,
      orientation,
    } = this.props;
    return (
      <div
        styleName={
          classnames(
            'description-wrapper',
            {
              transformUp: action === 'SHOW_TITLE',
              portrait: orientation === 'portrait',
             }
           )
         }
         style={{ transitionDelay: `${delay + 300}ms` }}
        >
        <div styleName={classnames('description', { hover })}>
          <div styleName="h2">{title}</div>
        </div>
      </div>
    );
  }
}

export default Description;
