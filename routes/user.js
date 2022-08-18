//var router = require('express').Router();

var express = require('express');
var app = express();
var router = express.Router();
var User = require ('../models/user');

var passport =require('passport');
var passportConf =require('../config/passport');
const { request } = require('express');
const { findOne } = require('../models/user');
const user = require('../models/user');
// url LOGIN

router.get ('/login',function(request,response){

    if(request.user) return response.redirect('/');

    response.render('account/login',{message :request.flash('loginMessage')});
});
router.post('/login',passport.authenticate('local-login',{
    successRedirect : '/profile',
    failureRedirect :'/login',
    failureFlash :true
}));

//URL / profil 

router.get('/profile',function(request,response){

    User.findOne({ _id : request.user._id }, function(err,user){
    if(err) return next(err);
    
    response.render('account/profile',{user:user});
});
});


// URL SIGNUP( inscription)
router.get('/signup',function(request,response,){

    response.render('account/signup',{errors :request.flash('errors')});


});
router.post('/signup',function(request,response,next){

        var user =new User();

        user.profile.name = request.body.name;
        user.email = request.body.email;
        user.password = request.body.password;
        user.profile.picture = user.gravatar();




            //User.findOne fait une requete vers la BDD
        User.findOne({email:request.body.email},function(err,existingUser){

            if(existingUser){
               // console.log(request.body.email + 'déja enregistre dans la base de données');
               
               request.flash('errors','Email déja present dans la base de donnée');
                return response.redirect('/signup');
            }else{
                    // on enregistre alors dans la bdd 
                  user.save(function(err){
                    if(err) return(err);
                    //response.json('Nouvel utilisateur crée');
                   // return response.redirect('/');
                    
                   request.logIn(user,function(err){
                    if(err) return next(err);
                    response.redirect('/profile');
                   });

                  });
            }
        });

});














//LOGOUT(deconnexion)

// code stephanie  ne fonctionne pas  
// router.get('/logout',function(request,response,next)
// {
//     request.logout();
//     response.redirect('/');
// });


router.get('/logout', function(request, response, next) {
    request.logout(function(err) {
      if (err) { return next(err); }
      response.redirect('/');
    
    
    });
  });

  // editer la page profil 

  router.get('/edit-profile',function(request,response,next){

        response.render('account/edit-profile',{message : request.flash('succes')}); 
  });

  router.post('/edit-profile',function(request,response,next){

    User.findOne({ _id : request.user._id }, function(err,user){
        if(err) return next(err);

        if(request.body.name) user.profile.name= request.body.name;
        if(request.body.address) user.address = request.body.address;

        user.save(function(err){
            if(err) return next(err);
            request.flash('succes','Vos informations ont été mises à jour avec succès');

            return response.redirect('edit-profile');
        })

    })
  });



//URL PROFIL
module.exports = router;
