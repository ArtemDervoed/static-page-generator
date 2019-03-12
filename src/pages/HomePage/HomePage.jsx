/* eslint-disable */
import React, { Fragment } from 'react';
import Helmet from 'react-helmet';

class HomePage extends React.PureComponent {
  render() {
    return (
      <Fragment>
        <Helmet title="Home" />
        <div>Home Page</div>
      </Fragment>
    );
  }
}

export default HomePage;
