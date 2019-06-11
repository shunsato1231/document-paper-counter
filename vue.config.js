module.exports = {
    css: {
        loaderOptions: {
            sass: {
                data: `@import "@/assets/scss/_mixin.scss";`
            }
        },
    },
    devServer: {
        proxy: 'https://fcm.googleapis.com/',
    }
  }
