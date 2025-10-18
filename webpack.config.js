// webpack.config.js
import path from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";

// Helper to get __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: "development", // or "production"
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true, // cleans dist before each build
  },
  module: {
    rules: [
      {
        test: /\.m?js$/, // match .js or .mjs files
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.tsx?$/, // Apply ts-loader to .ts and .tsx files
        use: 'ts-loader'
      }

    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject: "body",
    }),
  ],
  devServer: {
    static: "./dist",
    open: true,
    port: 3000,
  },
  resolve: {
    extensions: [".js"],
  },
};