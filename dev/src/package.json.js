module.exports = (settings) => `
{
  "name": "${settings.slug}",
  "version": "0.0.1",
  "description": "${settings.title}",
  "author": ${JSON.stringify(settings.author)},
  "private": true,
  "dependencies": {
    "expose-loader": "^0.7.5",
    "jquery": "^3.3.1",
    "bootstrap": "^4.3.1",
    "popper.js": "^1.14.6",
    "font-awesome": "^4.7.0",
    "js-cookie": "^2.2.0",
    "lightbox2": "^2.9.0"
  },
  "devDependencies": {
    "webpack": "^4.26.1"
  }
}
`;
