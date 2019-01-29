module.exports = {
  globals: {
    "process.env.NODE_ENV": "production",
    'DEFAULT_API_URL': "https://grimoire.fydir.ru/rasputin",
    'DEFAULT_CLIENT_ID': "13671"
  },
  moduleDirectories: ["node_modules", "vendor"],
  moduleFileExtensions: ["js", "jsx"],
  setupFiles: [ "./jest/setup.js" ]
}
