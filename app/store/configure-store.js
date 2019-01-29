if (process.env.NODE_ENV == 'development') {
  module.exports = require('./configure-store.dev.js')
}
else {
  module.exports = require('./configure-store.prod.js')
}
