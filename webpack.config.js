const path = require('path');  // This imports the 'path' module
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: {
    popup: './src/index.js',  // Entry point for popup
  },
  output: {
    filename: '[name].bundle.js',  // Output a separate file for each entry point
    path: path.resolve(__dirname, 'dist'),  // Correctly resolve the path to the 'dist' folder
    clean: true,  // Ensures the dist folder is cleaned before each build
  },
  mode: 'production',  // You can switch to 'development' for easier debugging
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,  // Handles both .js and .jsx files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,  // Add this rule to handle CSS files
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new Dotenv({
      path: './.env',  // Path to .env file (this is the default)
      systemvars: true,  // Add Node.js environment variables to process.env
    }),
  ],
};
