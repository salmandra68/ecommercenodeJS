var router =require('express').Router();

const category = require('../models/category');
var Category = require('../models/category');

// creation des url  
// URL ajouter une categorie (get/post)

router.get('/add-category',function(request,response,next){
    
    response.render('admin/add-category',{message :request.flash('success')});
});



router.post('/add-category',function(request,response,next){

        var category = new Category();

        category.name = request.body.name;

        //on savegarde dans la bdd

        category.save(function(err){

            if(err) return next(err);
            request.flash('success','Catégorie créée avec succès');
                return response.redirect('/add-category');

        });

});

module.exports =router;