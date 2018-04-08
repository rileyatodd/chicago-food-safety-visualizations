var path = require('path')
// var BundleAnalyzerPlugin  = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const { TsConfigPathsPlugin, CheckerPlugin } = require('awesome-typescript-loader');

module.exports =
{ entry: './src/index.js'
, devtool: 'source-map'
, plugins: 
  [ new UglifyJSPlugin({sourceMap: true})
  // , new BundleAnalyzerPlugin()
  , new TsConfigPathsPlugin()
  , new CheckerPlugin() ]
, output:
  { path: path.join(__dirname, 'dist')
  , filename: 'bundle.js'
  , publicPath: '/webpack' }
, module:
  { loaders:
    [ { test: /\.(t|j)sx?$/
      , include: path.join(__dirname, 'src')
      , loader: 'awesome-typescript-loader' }
    , { test: /\.css$/
      , use: [
        'style-loader',
        { loader: 'typings-for-css-modules-loader'
        , options: 
          { modules: true
          , namedExport: true } } ] } ] }
, resolve:
  { alias:
    { src: path.resolve(__dirname, 'src')
    , models: path.resolve(__dirname, 'src/models')
    , components: path.resolve(__dirname, 'src/components')
    , containers: path.resolve(__dirname, 'src/containers')
    , store: path.resolve(__dirname, 'src/store')
    , reducers: path.resolve(__dirname, 'src/reducers')
    , actions: path.resolve(__dirname, 'src/actions')
    , util: path.resolve(__dirname, 'src/util')
    , styles: path.resolve(__dirname, 'src/styles') } 
  , extensions: [".ts", ".tsx", ".js", ".jsx"] } }
