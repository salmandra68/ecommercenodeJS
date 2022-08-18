var router = require('express').Router();
var Cart = require('../models/cart');
var Product = require('../models/product');
var User = require('../models/user');
var async = require('async');

// creation url de la page d 'aaccueil

router.get('/', function (request, response) {
  response.render('main/home');
});

router.get('/about', function (request, response) {
  response.render('main/about');
  // Product.find({category : request.params.id })
});

// url ppour afficher les produits d une categorie

router.get('/products/:id', function (request, response, next) {
  Product.find({ category: request.params.id })
    .populate('category')
    .exec(function (err, products) {
      if (err) return next(err);
      response.render('main/category', { products: products });
    });
});

// url pour afficher un produit

router.get('/product/:id', function (request, response, next) {
  Product.findById({ _id: request.params.id }, function (err, product) {
    if (err) return next(err);

    response.render('main/product', { product: product });
  });
});

router.post('/product/:product_id', function (request, response, next) {
  // on cherche le proritéraire du poanie


  Cart.findOne({ owner: request.user._id }, function (err, cart) {
    // p, ajoute le produit au panier

      //cart = new Cart({ owner: request.user._id });
    
        cart.items.push({
      item: request.body.product_id,
      price: request.body.priceValue,
      quantity: request.body.quantity,
    });

    cart.total = cart.total + parseFloat(request.body.priceValue).toFixed(2);
   
    /// sauvergarde du panier dans la bdd
    cart.save(function (err) {
      if (err) return next(err);

      // si cest ok, on redirige l utilisateur vers la page panier ( cart)
      return response.redirect('/cart');
    });
  });
});
// url pour afficher la page  du  panier
router.get('/cart', function (request, response, next) {
  Cart.findOne({ owner: request.user._id })
    .populate('items.item')

    .exec(function (err, foundCart) {
      if (err) return next(err);
      response.render('main/cart', { foundCart: foundCart });
    });
});

module.exports = router;
