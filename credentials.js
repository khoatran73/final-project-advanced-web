module.exports = {
    authProviders: {
        gooogle: {
            development: {
                appId: "182621371836-5geucbok4teva19lcfsiugvkcv35fvgb.apps.googleusercontent.com", 
                appSecret: "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",
                callbackURL: 'http://localhost:3000/account/google/callback',
            }
        }
    }
}