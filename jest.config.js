module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': ['babel-jest', {
      presets: [
        ['@babel/preset-env', { modules: 'commonjs' }]
      ]
    }]
  },
  moduleFileExtensions: ['js', 'json'],
  testMatch: ['**/tests/**/*.test.js'],
  testTimeout: 120000, // 2 minutes for slow network requests
  verbose: true,
  maxWorkers: 1, // Run tests serially (one at a time) - prevents hanging
  collectCoverageFrom: [
    'content/**/*.js',
    '!content/**/*.bundle.js'
  ]
};

