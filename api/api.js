var router = require('express').Router();
var async =require('async');
//var faker = require('@faker-js/faker')
const { faker } = require('@faker-js/faker');

var CAtegory =require('../models/category');
var Product=require('../models/product');




// creation de 2 url get/ post 

// get : creation à partir d un nom de categorie 

router.get('/:name',function(request,response,next){

    async.waterfall([
        // tableau de function 
        function(callback){

            CAtegory.findOne({name: request.params.name},function(err,category){
                if(err) return next(err);
                callback(null,category);
            });
        },


//        // import { faker } from '@faker-js/faker';
//         // or, if using CommonJS
//         // const { faker } = require('@faker-js/faker');
// // const { faker } = require('@faker-js/faker');
//         var randomProduct = faker.name.fullName(); // Rowan Nikolaus
//         var randomEmail = faker.internet.email(); // Kassandra.Haley@erich.biz    


        function(category,callback){
            for(var i = 0; i < 15; i++){

                var product = new Product();
                product.category = category._id;
                product.name = faker.commerce.productName()
                product.price= faker.commerce.price()
                product.image = faker.image.image()
            
                product.save();
            }

        }
    
    ]);
    response.json({message:'success'});
});


// post : extraction des données pout ensuite les afficher % get 





module.exports= router;