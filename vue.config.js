// 项目部署基础
const webpack = require('webpack');
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']
const BASE_URL = process.env.NODE_ENV === 'production' ? './' : '/'
// const url = 'http://uat-api.jiajutech.com/'
// const url = 'http://api.jiajutech.com/'
const url = 'https://720.jiajutech.com/'
module.exports = {
    // Project deployment base
    publicPath: BASE_URL,
    // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
    lintOnSave: 'error',
    productionSourceMap: false,
    // eslint-disable-next-line
    configureWebpack: (config) => {
        if (process.env.NODE_ENV === 'production') {
            // 仅在生产环境下启用该配置
            return {
                plugins: [
                    new CompressionWebpackPlugin({
                      filename: '[path].gz[query]',
                      algorithm: 'gzip',
                      test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
                      threshold: 1024, // 只有大小大于该值的资源会被处理,当前配置为对于超过1k的数据进行处理，不足1k的可能会越压缩越大
                      minRatio: 0.99, // 只有压缩率小于这个值的资源才会被处理
                      deleteOriginalAssets: false // 删除原文件
                    })
                ],
                optimization: {
                    splitChunks: {
                        cacheGroups: {
                            'viewerjs': {
                                name: 'viewerjs.js',
                                test: /[\\/]node_modules[\\/]viewerjs[\\/]/,
                                chunks: 'all',
                                priority: 8,
                                reuseExistingChunk: true,
                                enforce: true,
                            }
                        }
                    }
                }
            }
        }
    },
    css: {
        loaderOptions: {
            less: {
                javascriptEnabled: true
            }
        },
        // https://github.com/vuejs/vue-cli/issues/3771
        extract: true
    },
    devServer: {
        disableHostCheck: true,
        open: true,
        historyApiFallback: true,
        proxy: {
            '^/render': {
                target: url
            },
            '^/render': {
                target: url
            },
            '^/basic': {
                target: url
            },
            '/appcenter': {
                target: 'https://apigateway.oppein.com',
                // target: 'https://opyx-mtds-pro.oss-cn-shenzhen.aliyuncs.com/', // 暂时使用欧派的正式环境地址。测试地址需要申请小程序资格
                changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
                pathRewrite: {
                    '^/appcenter': '/appcenter' //重写接口访问
                },
            },
        }
    },
}