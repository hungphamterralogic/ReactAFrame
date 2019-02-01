const alias = (path) => ({
  configFirebase$: `${path}/src/config/firebase.js`,
  generalStyles$: `${path}/src/assets/styles/general.js`
});

module.exports = { alias };