/* eslint-disable*/
import React from 'react';
import CSSModules from 'react-css-modules';
import classnames from 'classnames';
import styles from './Column.css';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Description from './Description';
import Video from './Video';
import DelayRender from '_components/DelayRender';
import ReactGA from 'react-ga';

@CSSModules(styles, { allowMultiple: true })
class Column extends React.PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    subTitle: PropTypes.string,
    image: PropTypes.string.isRequired,
    video: PropTypes.string.isRequired,
    action: PropTypes.string.isRequired,
    delay: PropTypes.number.isRequired,
    orientation: PropTypes.string.isRequired,
    homePageLoaded: PropTypes.bool.isRequired,
    onTitleShowed: PropTypes.func.isRequired,
  }

  state = {
    hover: false,
  }

  handleLinkClick = (e) => {
    ReactGA.event({
      category: 'Category',
      action: 'open',
      label: this.props.title,
    });
  }

  handleMouseEnter = () => {
    this.setState({ hover: true });
  }

  handleMouseLeave = () => {
    this.setState({ hover: false });
  }

  render() {
    const {
      title,
      subTitle,
      image,
      action,
      delay,
      video,
      orientation,
      onTitleShowed,
      homePageLoaded,
    } = this.props;
    const { hover } = this.state;
    const url = title.toLowerCase().replace(/ /g, '-');
    const path = `/${url}`;
    return (
      <Link
        to={url}
        onClick={this.handleLinkClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        styleName={classnames('column', orientation, { transformUp: action === 'HIDE' })}
        style={{ transitionDelay: `${delay}ms` }}
      >
        <DelayRender delayRender={50}>
          <Video
            hover={hover}
            video={video}
            transformDown={action === 'HIDE'}
            image={image}
            orientation={orientation}
            homePageLoaded={homePageLoaded}
          />
        </DelayRender>
        <Description
          orientation={orientation}
          hover={hover}
          title={title}
          subTitle={subTitle}
          action={action}
          delay={delay}
          onTitleShowed={onTitleShowed}
          orientation={orientation}
        />
    </Link>
    );
  }
}

export default Column;
