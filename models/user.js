// chargment de maongoose ( connexion entre node et mongoDB)

var mongoose =require('mongoose');

// chargement de brcypt : hashage mdp avant meme quils soient entrres dans le BDD

var bcrypt = require('bcrypt-nodejs');

var crypto = require('crypto');

var Schema = mongoose.Schema;

// création du modele ( la classe) pour USER

var UserSchema = new Schema({

        email:{
                type:String,
                unique:true,
                lowercase:true
        },
        password:String,
        profile:{
            name:{ type:String,default:''},
            picture:{ type:String,default:''},

        },
        address:String,
        history:[{
            date: Date,
            paid:{
                type:Number,
                default:0
            }
        }]

});

// cryptage mot de passe (brypt)

UserSchema.pre('save',function(next){

    var user =this;

    // crypter le mot de passe suelment si il a ete modifié ou si il est nouveau 
    if(!user.isModified('password')) return next ();
    
    bcrypt.genSalt(10,function(err,salt){
        if(err) return next(err);

        // cryp le mdp avec le nouveau salt 
        bcrypt.hash(user.password,salt,null,function(err,hash){
            if (err) return next (err);

            user.password = hash;

            next(); 
        })

    })
    
});
// comparaison entre mdp et celui prensent dans la bdd

// creation fonction personnalisée avec mong oose
UserSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password,this.password);

}

// function personnalise pour afficher un avatar 
UserSchema.methods.gravatar = function(size){
    if(!this.size) size=200;

    // si lemail ne correspond pas, alors on retriuve une imlage aléaztoire( gravatar)
    if(!this.email) return 'https:/gravatar.com/avatar/?s' + size + '&d=robohash';

    // crypter afin que chaque utilisateiur ait une image unique 
    var md5 = crypto.createHash('md5').update(this.email).digest('hex');

    // on retourne l image 
    return 'https:/gravatar.com/avatar/' + md5 + '?s=' + size + '&d=robohash';

}

module.exports = mongoose.model('User',UserSchema);