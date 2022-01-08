const credentials = require('../credentials')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const LocalStrategy = require('passport-local').Strategy;
const config = credentials.authProviders
const User = require('../models/User')
module.exports = function(passport) {
    passport.use(new GoogleStrategy({
        clientID        : config.gooogle.development.appId,
        clientSecret    : config.gooogle.development.appSecret,
        callbackURL     : config.gooogle.development.callbackURL,
        profileFields: ['id', 'displayName', 'name', 'picture.type(large)']
    },
    function(accessToken, refreshToken, profile, done) {
        process.nextTick(function() {

            User.findOne({ 'uid' : profile.id }, function(err, user) {
                if (err)
                    return done(err);
                if(profile.emails[0].value.split('@', 2)[1]!=='student.tdtu.edu.vn' && profile.emails[0].value.split('@', 2)[1]!=='tdtu.edu.vn'){
                    return done(null,false, {message: 'Vui lòng đăng nhập bằng email sinh viên!'});
                }
                
                if (user) {
                    return done(null, user); 
                } else {
                
                    var newUser = new User();
                    newUser.uid = profile.id;                                
                    newUser.name  = profile.name.givenName + ' ' + profile.name.familyName; 
                    newUser.avatar = profile.photos[0].value;
                    newUser.role = 3;
                    newUser.created = Date.now();
                    newUser.email = profile.emails[0].value; 
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser); 
                    });
                }

            });

        })

    }));

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });
}