module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "jest": true,
    "node": true
  },
  "globals": {
    "process.env.NODE_ENV": true
  },
  "extends": "eslint:recommended",
  "parser": "babel-eslint",
  "plugins": [ "react" ],
  "root": true,
  "rules": {
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
    "no-console": 0,
    "no-extra-boolean-cast": 0
  }
}
