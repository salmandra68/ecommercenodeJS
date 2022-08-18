//const { disconnect } = require('mongoose');
var passport = require ('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require ( '../models/user');

//1  serialize et deserialze
passport.serializeUser(function(user,done){
    done(null, user._id);

});

passport.deserializeUser(function(id,done){

    //on verifie que l utilisateur existe 
    
    User.findById(id,function(err,user){

        // si il existe succes ok 
        done(err,user);
    });

});


//2 passerelle 
passport.use('local-login',new LocalStrategy({

        usernameField:'email',
        passwordField: 'password',
        passReqToCallback:true
        },

        function(request,email,password,done){
            User.findOne({email:email},function(err,user){

                if (err) {return done(err);}
                if(!user){return done(null,false,request.flash('loginMessage','Utilisateur non existant'));}
                if(!user.comparePassword(password)){
                    return done(null,false,request.flash('loginMessage','Les mots de passe ne correspondent pas'));
                }
                //r retoiurn l utilisateur si aucune erreur n 'intervientt 
                return done(null,user);
            });
        
        }));


//3 methode personnalisee pour valider 
exports.isAuthenticated =function(request,response,next){
    if(request.isAuthenticated()){
        return next();

    }
    response.redirect('/login');
}