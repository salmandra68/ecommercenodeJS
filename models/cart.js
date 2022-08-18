var mongoose =require ('mongoose');
const { schema } = require('./category');
var User = require ('../models/user');
var Schema =mongoose.Schema;
var Product = require('../models/product');


var CartSchema = new Schema({
    owner: {type:Schema.Types.ObjectId, ref:'User'},
    total:{type:Number,default:0},
    items: [{
        item:{ type:Schema.Types.ObjectId, ref:'Product'},
        quantity:{type:Number,default:1},
        price:{type:Number,default:0} 
    }]
});
module.exports = mongoose.model('Cart',CartSchema);

