export default async (cookies, url) => {
  if (__SERVER__) {
    return {
      routing: {
        location: {
          pathname: url,
        },
      },
    };
  }
  return Promise.resolve({
    ...window.__INITIAL_STATE__,
  });
};
