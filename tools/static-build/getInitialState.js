// import { Your api functions } from '_api';

export default async (url) => {
  return {
    categories: {
      requestStatus: 'SUCCESS',
    },
    routing: {
      location: {
        pathname: url,
      },
    },
  };
};
