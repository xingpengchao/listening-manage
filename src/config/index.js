const { defineConfig } = require('@vue/cli-service')
module.exports={
    devServer: {
        proxy: { // 配置跨域
            '/api': {
                target: `http://1.13.173.188:8080/`, //请求后台接口
                changeOrigin: true, // 允许跨域
                pathRewrite: {
                    '^/api': ' ' // 重写请求
                }
            }
        }
    }
}

module.exports = defineConfig({

    transpileDependencies: true,})


