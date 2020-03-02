if (document.readyState == "loading") {
    document.documentURI= sessionStorage.getItem("URI")
    if(document.readyState=="loading") {
        document.addEventListener("DOMContentLoaded", ready)
    }
}else{
    ready()
}
var tempCart=[]
var saveCart = []

function ready() {
    var removeCartItemButtons = document.getElementsByClassName("btn-danger")
    for (var i = 0; i < removeCartItemButtons.length; i++) {
        var button = removeCartItemButtons[i]
        button.addEventListener('click', removeCartItem)
    }
    var quantityInputs = document.getElementsByClassName("cart-quantity-input")
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i]
        input.addEventListener("change", quantityChanged)
    }

    //add item after button click but before navigation
    if(sessionStorage.length>0){
        if(performance.navigation.type==1){ //so refreshing the page doesn't add another item
            console.log("loadingCart becuase of refresh")
            loadCart()
        }else{
            if(sessionStorage.getItem("URI")=="http://localhost:63342/WorkingCopy/OnlineStore/Views/ShoppingCart.html"){ //Tells if shopping cart icon was clicked
               console.log('loadingCart becuase shopping cart icon')
                loadCart()
            }else{
                console.log("adding Item to Cart")
                addToCartClicked()
            }
        }
    }

    document.getElementsByClassName("btn-purchase")[0].addEventListener('click', purchaseClicked)
}

//Seems to work may need further testing
function removeCartItem(event) {
    console.log("removeCartItem")
    var buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()
    updateCartTotal()
   console.log("BEFORE\n"+saveCart)
    for(var i = 0; i<saveCart.length;i++){

        if(JSON.stringify(buttonClicked.parentElement.parentElement.innerHTML)==JSON.stringify(saveCart[i])){
            //console.log("Found identical item, so splice is incorrect if this does not work")
            saveCart.splice(i,1)
        }
    }
    console.log("AFTER\n"+saveCart)
    sessionStorage.setItem("cart", JSON.stringify(saveCart))


}

//after you click purchase the purchase button is unresponsive when it should say nothing in cart
function purchaseClicked(){
    console.log("Purchase button was clicked")
    if(JSON.parse(sessionStorage.getItem("cart")).length>0){
        alert("Thank you for your purchase!")
        var cartItems = document.getElementsByClassName("cart-items")[0]
        while(cartItems.hasChildNodes()){
            cartItems.removeChild(cartItems.firstChild)
        }
        updateCartTotal()
        sessionStorage.removeItem("cart")
    }else{
        alert("You don't have anything in the cart to purchase!")
    }

}

//If the quantity changes need to update value in array
function quantityChanged(event) {
    console.log("quantityChanged")
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateCartTotal()
}

function addToCartClicked(event) {
    console.log("addToCartClicked")
    var title = sessionStorage.getItem("title")
    var price = sessionStorage.getItem("price")
    Number(price)
    var imageSrc = sessionStorage.getItem("image")
    addItemToCart(title, price, imageSrc)
    updateCartTotal()
}


function loadCart(){
    console.log("loadCart")
    if(sessionStorage.getItem("cart")!=null) {
        var cartItems = document.getElementsByClassName("cart-items")[0]
        //console.log("HERE")
        var temp = JSON.parse(sessionStorage.getItem("cart"))
        for (var i = 0; i < temp.length; i++) {
            //console.log("LOOP 1")
            saveCart[i] = temp[i]
        }
        if(sessionStorage.getItem("cart")!=null){
            tempCart = JSON.parse(sessionStorage.getItem("cart"))
            //console.log(tempCart.length)
            for(var i = 0; i<tempCart.length; i++){
                var cartRow2 = document.createElement('div')
                cartRow2.classList.add("cart-row")
                //console.log("tempCart[i] "+tempCart[i])
                cartRow2.innerHTML = tempCart[i]
                cartItems.append(cartRow2)
                cartRow2.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
                cartRow2.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
            }
        }
        updateCartTotal()
    }
}
function addItemToCart(title, price, imageSrc) {
    console.log("addItemToCart")
    var cartRow = document.createElement('div')
    cartRow.classList.add("cart-row")
    var cartItems = document.getElementsByClassName("cart-items")[0]
    var cartItemNames = cartItems.getElementsByClassName("cart-item-title")

    //This doesn't work
    for(var i = 0; i<cartItemNames.length;i++){
        if(cartItemNames[i].innerText==title){
            alert("This item is already in your cart")
            return
        }
    }
    loadCart()
    var cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class=" btn-danger" type="button">Remove</button>
        </div>`
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)


        //console.log("FINISHED LOOP 1")
        /*for(var i = 0; i<saveCart.length;i++){
            //console.log("In saveCart "+saveCart[i])

        }*/
        //console.log("FINISHED LOOP 2")


    saveCart.push(cartRowContents)
    //console.log("Going into saveCart "+cartRowContents)


    sessionStorage.setItem("cart", JSON.stringify(saveCart))
    //console.log("sending to session storage "+JSON.stringify(saveCart))
    sessionStorage.setItem("URI", "http://localhost:63342/WorkingCopy/OnlineStore/Views/ShoppingCart.html")
}

function updateCartTotal() {
    console.log("updateCartTotal")
    var cartItemContainer = document.getElementsByClassName("cart-items")[0]
    var cartRows = cartItemContainer.getElementsByClassName("cart-row")
    var total = 0
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName("cart-price")[0]
        var quantityElement = cartRow.getElementsByClassName("cart-quantity-input")[0]
        var price = parseFloat(priceElement.innerText.replace("$", ""))
        var quantity = quantityElement.value
        total = total + (price * quantity)
    }
    //Low priority issue, get total to display .90 instead of .9
    total = Math.round(total * 100) / 100
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total
}

