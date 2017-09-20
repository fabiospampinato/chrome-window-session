
/* IMPORT */

const path = require ( 'path' ),
      chalk = require ( 'chalk' ),
      CopyWebpackPlugin = require ( 'copy-webpack-plugin' ),
      HtmlWebpackPlugin = require ( 'html-webpack-plugin' ),
      SummaryPlugin = require ( 'webpack-summary' ).default,
      webpack = require ( 'webpack' );

/* VARIABLES */

const ENVIRONMENT = process.env.NODE_ENV || 'development',
      DEVELOPMENT = ENVIRONMENT === 'development',
      PRODUCTION = !DEVELOPMENT;

/* CONFIG */

const config = {
  // devtool: DEVELOPMENT ? 'cheap-module-source-map' : false,
  entry: {
    background: path.join ( __dirname, 'src/background/index.ts' ),
    popup: path.join ( __dirname, 'src/popup/index.tsx' )
  },
  output: {
    path: path.join ( __dirname, 'dist' ),
    filename: '[name].js'
  },
  module: {
    rules: [{
        test: /\.tsx?$/,
        use: ['awesome-typescript-loader']
      }, {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }, {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }, {
        test: /\.html$/,
        use: ['html-loader']
      }, {
        test: /\.(jpg|jpeg|png|gif|eot|otf|svg|ttf|woff|woff2)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]'
          }
        }]
      }]
  },
  resolve: {
    extensions: ['.json', '.js', '.jsx', '.ts', '.tsx']
  },
  plugins: [
    new webpack.DefinePlugin ({
      'process.env.NODE_ENV': JSON.stringify ( ENVIRONMENT )
    }),
    new CopyWebpackPlugin ([{
      from: path.resolve ( 'src/manifest.json' ),
      to: path.resolve ( 'dist/manifest.json' )
    }]),
    new HtmlWebpackPlugin ({
      template: path.join ( __dirname, 'src/background/index.html' ),
      filename: 'background.html',
      chunks: ['background']
    }),
    new HtmlWebpackPlugin ({
      template: path.join ( __dirname, 'src/popup/index.html' ),
      filename: 'popup.html',
      chunks: ['popup']
    }),
    new SummaryPlugin ({
      normal: chalk.yellow ( '[{entry.name}] Bundled into "{entry.asset}" ({entry.size.MB}MB) in {time.s}s. {stats.warnings.length} warning(s).' ),
      watching: 'Bundle rebuilt in {time.s}s.'
    })
  ],
  stats: {
    assets: false,
    chunks: false,
    hash: false,
    modules: false,
    performance: false,
    timings: false,
    version: false,
    warnings: false
  }
};

/* EXPORT */

module.exports = config;
