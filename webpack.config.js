const path = require("path")
const  nodeExternals  =  require ('webpack-node-externals' ) // no empaqueta el node modules
const CopyPlugin = require("copy-webpack-plugin");//copiar archivos estaticos
module.exports={
    target:'node',
    mode:'production',
    entry:{
        app:path.resolve(__dirname,'./index.js')

    },
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:'index.js'

    },
    externals:[nodeExternals()],

    module:{
        rules:[
           {
            test:/\.js$/,
            exclude:/node_modules/,
            loader:'babel-loader',
            options:{
                presets:[
                    [
                        "@babel/preset-env",
                        {
                            "targets": {
                                "node": "18.12.1",
                                "esmodules": false
                            }
                        }
                    ]
                ]
            }
            
           },
           {
            test: /\.ejs$/,
            loader: 'ejs-loader',
            options: {
                esModule: false, 
               
            }
        }


        ]
        
    },

    plugins:[
        new CopyPlugin({
            patterns:[{
                from :'src/views',
                to:'views'
            },
            {
                from:'src/public',
                to:'public'

            }
        
        ]
        })

    ]
}