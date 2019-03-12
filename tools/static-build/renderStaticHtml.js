import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { renderToString } from 'react-dom/server';
import Helmet from 'react-helmet';
import { Provider } from 'react-redux';
import createHistory from 'history/createMemoryHistory';

import configureStore from '../../src/store';
import renderHtml from '../../src/utils/renderHtml';
// import alphabetaContentNavigations from '../../src/pages/AlphaBetaPage/AlphaBetaContent/contentNavigations';
// import labsContentNavigations from '../../src/pages/LabsPage/content';
import getIntialState from './getInitialState';

const awwwards = ['film', 'tv', 'pub'];

const getPath = (path, name) => {
  // if (name === 'awards') {
  //   return '/awards';
  // }
  //
  // if (name === 'cases') {
  //   return '/cases';
  // }

  return path;
};

const getVimeoId = (vimeoVideoUrl) => {
  let vimeoId = '';
  for (let i = vimeoVideoUrl.length - 1; i !== 0; i -= 1) {
    if (vimeoVideoUrl[i] !== '/') {
      vimeoId += vimeoVideoUrl[i];
    } else {
      return vimeoId.split('').reverse().join('');
    }
  }
}

const renderPage = ({ path, name, ...rest }) => {
  const {
    initialState,
    routes,
    assets,
  } = rest;

  const staticContext = {};

  const pathByRoute = getPath(path, name);

  const store = configureStore(createHistory(), initialState);

  const ReactComponent = (
    <Provider store={store}>
      <StaticRouter location={pathByRoute} context={staticContext}>
        {renderRoutes(routes)}
      </StaticRouter>
    </Provider>
  );

  const componentHtml = renderToString(ReactComponent);
  const head = Helmet.renderStatic();

  const initialStateByRoute = {
    ...initialState,
    routing: {
      location: {
        pathname: pathByRoute,
      },
    },
  };

  const html = renderHtml(head, assets, componentHtml, initialStateByRoute);

  if (name === 'cases') {
    const { cases: { allCases } } = initialState;

    return {
      path,
      name,
      html,
      children: allCases.map((singleCase) => {
        // const { id, video_vimeo_url, category_type } = singleCase;
        //
        // const initialStateWithCurrentCase = {
        //   ...initialStateByRoute,
        //   routing: {
        //     location: {
        //       pathname: `/cases/${id}`,
        //     },
        //   },
        // };
        //
        // return renderPage({
        //   ...rest,
        //   path: `/cases/${id}`,
        //   name: id,
        //   initialState: initialStateWithCurrentCase,
        // });
      }),
    };
  }

  // if (!isNaN(name)) {
  //   const { cases: { allCases } } = initialState;
  //   return {
  //     path,
  //     name,
  //     html,
  //     children: allCases.filter(el => el.id === name).map((caseElement) => {
  //       const { id, video_vimeo_url, category_type } = caseElement;
  //       const videoId = getVimeoId(video_vimeo_url);
  //       const pathname = `/cases/${id}/${category_type}-${videoId}`
  //
  //       const initialStateWithCurrentCaseFilm = {
  //         ...initialStateByRoute,
  //         routing: {
  //           location: {
  //             pathname: pathname,
  //           },
  //         },
  //       };
  //
  //       return renderPage({
  //         ...rest,
  //         path: pathname,
  //         name: `/${category_type}-${videoId}`,
  //         initialState: initialStateWithCurrentCaseFilm,
  //       });
  //     }),
  //   };
  // }

  return {
    path,
    name,
    html,
    children: [],
  };
};

export default async (routes, assets) => {
  const pagesToRender = routes[0].routes;
;
  const pages = pagesToRender
    .map(({ path, name }) => ({ path, name }));

  const initialState = await getIntialState('/');

  return pages.map(({ path, name }) =>
    renderPage({
      path,
      name,
      initialState,
      routes,
      assets,
    }));
};
