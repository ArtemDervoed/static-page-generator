import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import styles from './Categories.css';
import MaskIE from './MaskIE';
import VideoColumns from './VideoColumns';
import delay from 'lodash/delay';

import Menu from '_components/Menu';
import MobileMenu from '_components/MobileMenu';

const links = [
  { label: 'Awards', link: '/awards', isActive: true },
  { label: 'About', link: '/about', isActive: true },
  { label: 'Contact', link: '/contacts', isActive: true },
];
const orientationCheck = !__SERVER__ ? window.matchMedia('(max-aspect-ratio: 1/1)') : {};

@CSSModules(styles, { allowMultiple: true })
class Categories extends React.PureComponent {
  static propTypes = {
    categories: PropTypes.object.isRequired,
    homePageLoaded: PropTypes.bool.isRequired,
  }
  state = {
    action: '',
    hideMask: false,
    orientation: '',
  }

  componentDidMount() {
    orientationCheck.addListener(this.resetMenu, 1000);
    this.setState({ orientation: !orientationCheck.matches ? 'landscape' : 'portrait' }) // eslint-disable-line
    const { homePageLoaded } = this.props;
    if (homePageLoaded) {
      delay(() => { //eslint-disable-line
        this.setState({ action: 'SHOW_TITLE' });
      }, 1000);
    }
  }

  componentWillReceiveProps({ homePageLoaded }) {
    if (homePageLoaded && !this.props.homePageLoaded) {
      delay(() => { //eslint-disable-line
        this.setState({ action: 'SHOW_TITLE' });
      }, 1000);
    }
  }

  componentWillUnmount() {
    orientationCheck.removeListener(this.resetMenu);
  }

  resetMenu = (mediaQueryList) => {
    const { matches } = mediaQueryList;
    if (!matches) {
      this.setState({ orientation: 'landscape' });
    } else if (matches) {
      this.setState({ orientation: 'portrait' });
    }
  };

  handleTitleShowed = () => {
    this.setState({ hideMask: true });
  }

  render() {
    const { action, hideMask, orientation } = this.state;
    const { categories, homePageLoaded } = this.props;
    return (
      <div styleName="root">
        <Menu links={links} showMenu />
        <MobileMenu currentCategory="" links={links} />
        <div id="categories" styleName={`catogories ${orientation}`}>
          <VideoColumns
            orientation={orientation}
            categories={categories}
            action={action}
            onTitleShowed={this.handleTitleShowed}
            homePageLoaded={homePageLoaded}
          />
          {
            (orientation === 'landscape' || orientation === '') &&
              <div styleName="mask">
                <MaskIE action={hideMask ? 'HIDE' : ''} />
              </div>
          }
        </div>
      </div>
    );
  }
}

export default Categories;
