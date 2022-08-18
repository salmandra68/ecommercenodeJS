// inclure la librairie express 

const { SlowBuffer } = require('buffer');
var express =require('express');



var morgan =require('morgan');

//librairie mangoose

var mongoose = require('mongoose');

// body-parser 

var bodyParser =require ('body-parser');
 
// moteur de template var ejs 

var ejs =require('ejs');
var engine = require('ejs-mate');

//3 librairies pour gérer les messages flashs 

var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash=require('express-flash');


// passerelle pour se connecter à node ( lien node BDD passport) 
var passport = require('passport');


// stockage des sessions(id) et cookieParse

var mongoStore = require('connect-mongo')(session);

//declaration du modele Category 

var Category =require('./models/category');

// declaration de notre midleware ( lien avec le panier cf middleware.js)

var cartLenght =require('./middlewares/middleware');
// stocker l objet express dans une variable plus courte 

var app= express();
//inclure les fichiers secret.js

var secret = require('./config/secret');


// connexion a la bdd attentyion modifie vs cihier stephanie
  const database = module.exports = () => {

      try {
    
         mongoose.connect(
            secret.database,
         );       console.log("Database connected successfully");

      }catch (error){
         console.log(error);
        console.log("database connection failed");
    }

 };
 database();



// PASSERELLES ( middleware)
app.use(express.static(__dirname + '/public'));
app.use(morgan("dev"));

app.engine('ejs',engine);
app.set('view engine','ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// affichage messages flash et de gestions des cookies 

//var MongoStore = require('connect-mongo')(session);
app.use(cookieParser());
app.use(session({
    resave:true,
    saveUninitialized:true,
    secret:'secret.secretKey',
    store:new mongoStore({
        url:secret.database,
        autoReconnect:true})
}));

app.use(flash());

// autehtification 
app.use(passport.initialize());
app.use(passport.session());

// attribution pas de defaut d' objet user  à toutes les mainRoutes)
app.use(function(request,response,next){
    response.locals.user = request.user;
    next();
});


// Pour rechercher toputes les categories 

app.use(function(request,response,next){
    Category.find({},function(err,categories){
        if(err) return next(err);

        // on stocke les categories trouvées dans la variable categories 
            response.locals.categories = categories;
            next();
    

    });
});


// pour utiliser notre middleware(gestion des quantites dans le panier)
app.use(cartLenght);



// definition du chemin ' routes) des pages principales 
var mainRoutes=require('./routes/main');
app.use(mainRoutes);


var userRoutes=require('./routes/user');
app.use(userRoutes);

var adminRoutes=require('./routes/admin');
app.use(adminRoutes);

var apiRoutes=require('./api/api');
app.use('/api',apiRoutes);


// methode listen d express 

app.listen(secret.port,function(err){

    if (err) throw err;
    console.log('leserveur est lance sur le port 8080' + secret.port);

})