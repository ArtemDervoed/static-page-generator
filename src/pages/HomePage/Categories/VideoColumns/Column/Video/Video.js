/* eslint-disable */
import React from 'react';
import CSSModules from 'react-css-modules';
import classnames from 'classnames';
import styles from './Video.css';
import PropTypes from 'prop-types';
import { detect } from 'detect-browser';

@CSSModules(styles, { allowMultiple: true })
class Video extends React.PureComponent {
  static propTypes = {
    video: PropTypes.string,
    image: PropTypes.string,
    delay: PropTypes.number,
    hover: PropTypes.bool.isRequired,
    orientation: PropTypes.string.isRequired,
    transformDown: PropTypes.bool.isRequired,
    homePageLoaded: PropTypes.bool.isRequired,
  }

  constructor() {
    super();
    this.node = null;
  }

  state = {
    showImage: false,
    hover: false,
  }
  //
  componentWillReceiveProps({ hover }) {
    if (hover && !this.props.hover) {
      this.node.currentTime = 0;
      this.node.play();
      this.setState({ showImage: false });
    }
  }

  rednderImage = (isFallBackVideo, image, hover, orientation, showImage) => {
    if (isFallBackVideo) {
      return (
        <div
          style={{ backgroundImage: `url(${image})`}}
          styleName={classnames('iePreview', { hover })}
        />
      );
    }
    return (
      <img
        styleName={classnames('wrapper-img', { hover, 'wide': orientation === 'portrait'  })}
        src={image}
        alt="."
      />
    );
  }

  render() {
    const {
      video,
      hover,
      transformDown,
      delay,
      image,
      orientation,
      homePageLoaded,
    } = this.props;

    const { showImage } = this.state;
    // const isTouch = detect().os === 'ios' || detect().os === 'android';
    const isIE = detect().name === 'ie';
    const isEdge = detect().name === 'edge';
    const isFallBackVideo = isIE || isEdge;
    let isVideoShow = orientation === 'portrait' || !hover || showImage || isFallBackVideo;

    return (
      <div styleName={classnames('col', { 'hover': hover })}>
          <div styleName={classnames('img', { 'hide': !isVideoShow })}>
            {
              this.rednderImage(isFallBackVideo, image, hover, orientation, showImage)
            }
          </div>
        <video
          ref={(node) => { this.node = node; }}
          styleName={classnames('wrapper', { 'hide': isVideoShow })}
          muted
          poster={image}
          autoPlay
          loop
          playsInline
        >
          <source src={video} type="video/mp4" />
      </video>
      </div>
    );
  }
}

export default Video;
