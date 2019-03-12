import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './VideoColumns.css';

import Column from './Column';
import PropTypes from 'prop-types';

@CSSModules(styles, { allowMultiple: true })
class VideoColumns extends React.PureComponent {
  static propTypes = {
    categories: PropTypes.object.isRequired,
    action: PropTypes.string.isRequired,
    orientation: PropTypes.string.isRequired,
    onTitleShowed: PropTypes.func.isRequired,
    homePageLoaded: PropTypes.bool.isRequired,
  }

  render() {
    const {
      categories: { categories },
      action,
      onTitleShowed,
      orientation,
      homePageLoaded,
    } = this.props;
    const rootClasses = `root ${orientation}`;
    return (
      <div styleName={rootClasses}>
        {
          categories.map((item, index) => index < 3 &&
            (
              <Column
                key={item.id}
                action={action}
                delay={(index + 1) * 100}
                title={item.title}
                subTitle={item.subtitle}
                video={item.preview.video_url}
                image={item.preview.image_url}
                orientation={orientation}
                homePageLoaded={homePageLoaded}
                onTitleShowed={onTitleShowed}
              />
            ),
          )
        }
      </div>
    );
  }
}

export default VideoColumns;
