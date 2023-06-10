const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
        devServer: {
            proxy: {
            '/api': {
                target: 'http://1.13.173.188:8080',
                changeOrigin: true,
                pathRewrite: { '^/api': '' },
            },
        },
    },

}
)


