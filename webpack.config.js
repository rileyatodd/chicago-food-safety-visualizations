var path = require('path')

module.exports =
{ entry: './js/index.js'
, output:
  { path: path.join(__dirname, 'dist')
  , filename: 'bundle.js'
  , publicPath: '/webpack'
  }
, module:
  { loaders:
    [ { test: /\.jsx?$/
      , loaders: ['react-hot-loader', 'babel-loader']
      , include: path.join(__dirname, 'js')
      }
    , { test: /\.css$/
      , loader: 'style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
      }
    ]
  }
, resolve:
  { alias:
    { models: path.resolve(__dirname, 'js/models')
    , components: path.resolve(__dirname, 'js/components')
    , containers: path.resolve(__dirname, 'js/containers')
    , store: path.resolve(__dirname, 'js/store')
    , reducers: path.resolve(__dirname, 'js/reducers')
    , actions: path.resolve(__dirname, 'js/actions')
    , util: path.resolve(__dirname, 'js/util')
    }
  }
}
