const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './src/index.js', // Adjust this based on your project structure
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,  // This ensures the dist folder is cleaned before each build
  },
  mode: 'production', // Ensure you're in the correct mode
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // Handles both .js and .jsx files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/, // Add this rule to handle CSS files
        use: ['style-loader', 'css-loader'], // Use both loaders
      },
    ],
  },
  plugins: [
    new Dotenv({
      path: './.env', // Path to .env file (this is the default)
      systemvars: true, // Add Node.js environment variables to process.env
    }),
  ],
};
