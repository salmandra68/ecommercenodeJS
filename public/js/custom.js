$(document).on('click','#plus',function(e){
    e.preventDefault();

    // on recupere les valeurs des champs price Value et quantity

    var priceValue=parseFloat($('#priceValue').val());

    var quantity = parseInt($('#quantity').val());

    priceValue += parseFloat($('#priceHidden').val());

     
    // quand on click sur + on ajoute 1
    quantity += 1;

    // on attibue les nouvelles vakleurs( quantity,prix total)

    $('#quantity').val(quantity);
    $('#priceValue').val(priceValue.toFixed(2));
    $('#total').html(quantity);

});

$(document).on('click','#minus',function(e){
    e.preventDefault();

    // on recupere les valeurs des champs price Value et quantity

    var priceValue=parseFloat($('#priceValue').val());

    var quantity = parseInt($('#quantity').val());
    // pour pas que la valeur des quantites passe en negatif
    if(quantity ===1){
        priceValue = $('#priceHidden');
        quantity = 1
    }else{

    priceValue -= parseFloat($('#priceHidden').val());

     
    // quand on click sur + on ajoute 1
    quantity -= 1;

    // on attibue les nouvelles vakleurs( quantity,prix total)

    $('#quantity').val(quantity);
    $('#priceValue').val(priceValue.toFixed(2));
    $('#total').html(quantity);
    }
});