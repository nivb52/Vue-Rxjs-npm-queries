const path = require('path')

module.exports = {
  rootDir: path.resolve(__dirname),
  moduleFileExtensions: ['js','vue','json'],
  transform: {
    "^.+\\.js$": "babel-jest",
    "^.+\\.vue$": "vue-jest"
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  
  testPathIgnorePatterns: [
    "<rootDir>/node_modules", '<rootDir>/dist'
  ],
  modulePaths: [
    "<rootDir>/node_modules"
  ],
  snapshotSerializers: ['jest-serializer-vue'],
//   setupFiles: ['<rootDir>/test/unit/setup'],
  testMatch: [
    // 'src/**/(tests/unit/*.spec.(js|jsx|ts|tsx) | __tests__/*.(js,jsx,ts,tsx))'
    '<rootDir>/src/tests/unit/*.spec.js',
    '<rootDir>/(tests/integration/*.test.(js|jsx|ts|tsx) |  **/__tests__/*.integration.spec.(js|jsx|ts|tsx))'
  ]
}
