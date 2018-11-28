module.exports = (settings) => `
{
  "name": "${settings.slug}",
  "version": "0.0.1",
  "description": "${settings.title}",
  "author": ${JSON.stringify(settings.author)},
  "private": true,
  "dependencies": {
    "expose-loader": "^0.7.5",
    "jquery": "^3.1.1",
    "bootstrap": "^4.1.3",
    "popper.js": "^1.14.6"
  },
  "devDependencies": {
    "webpack": "^4.26.1"
  }
}
`;
