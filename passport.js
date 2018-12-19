const jwtStratergy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = '';




module.exports = function(passport){
    let opts = {};
    opts.jwtFromReq = ExtractJwt.fromAuthHeader();
    opts.secretOrkey = 'shhhh';
    passport.use( new jwtStratergy(opts, (jwt_payload, done) => {
        User = '';
        if(err) return done(err ,false);
        if(user) return done(null, user);
        else{ return (null, false )}

    }))
}