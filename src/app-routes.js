import _map from 'lodash/map';
import routes from './routes';
import HomePage from '_pages/HomePage';
import App from './app';

export const componentRoutes = {
  '/': {
    exact: true,
    component: HomePage,
  },
};

const appRoutes = _map(routes, ({ path, ...rest }) => ({
  path,
  ...rest,
  ...componentRoutes[path],
}));

export default [
  {
    component: App,
    routes: appRoutes,
  },
];
