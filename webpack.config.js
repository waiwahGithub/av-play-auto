var path = require('path')
var webpack = require('webpack')
var yutil = require('youboralib-util')
var pkg = require('./package.json')

module.exports = {
  entry: './src/sp.js',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'sp.min.js',
    library: 'youbora',
    libraryTarget: 'umd',
    environment: {
      arrowFunction: false,
      bigIntLiteral: false,
      const: false,
      destructuring: false,
      dynamicImport: false,
      forOf: false,
      module: false,
    }
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: yutil.license(pkg),
      entryOnly: true
    })
  ]
}
