module.exports = {
  port: process.env.PORT,
  defaultLocale: 'en',
  api: 'https://geronimo.snpdev.ru',
  app: {
    htmlAttributes: { lang: 'en' },
    title: 'GERONIMO - Television, Commercial & Film productions',
    titleTemplate: 'Geronimo - %s',
    meta: [
      {
        name: 'description',
        content: 'Geronimo is an Antwerp based production company that develops high-end television, commercial and film productions with national and international recognition.',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:title',
        content: 'GERONIMO - Television, Commercial & Film productions',
      },
      // {
      //   property: 'og:image',
      //   content: require('_images/og-image.png'),
      // },
      {
        property: 'og:site_name',
        content: 'GERONIMO - Television, Commercial & Film productions',
      },
      {
        property: 'og:description',
        content: 'GERONIMO - Television, Commercial & Film productions',
      },
    ],
  },
};
