var Cart =require('../models/cart');
module.exports =function(request,response,next){

    // on verifie qu il y a ait une requete de l 'utilsiateur
    if(request.user){

        var total = 0;
        Cart.findOne({owner: request.user._id},
                    function(err,cart){
                        if(cart){
                            for(var i = 0; i<cart.items.length; i++){

                                total += cart.item[i].quantity;
                                }
                        
                                 response.locals.cart = total;
                        }else{
                             response.locals.cart = 0 
                        }   
                        next();   
                      })
        }else{
        next();
                }
    }