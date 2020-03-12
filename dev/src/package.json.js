module.exports = (settings) => `
{
  "name": "${settings.slug}",
  "version": "0.0.1",
  "description": "${settings.title}",
  "author": ${JSON.stringify(settings.author)},
  "private": true,
  "dependencies": {
    "@fortawesome/fontawesome-free": "^5.10.2",
    "bootstrap": "^4.4.1",
    "expose-loader": "^0.7.5",
    "jquery": "^3.3.1",
    "js-cookie": "^2.2.0",
    "lightbox2": "^2.9.0",
    "popper.js": "^1.14.6"
  },
  "devDependencies": {
    "webpack": "^4.41.5"
  }
}
`;
