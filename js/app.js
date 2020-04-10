let cartProductController = (function () {

    let Product = function (id, name, desc, price, imgSrc) {
        this.id = id;
        this.name = name;
        this.desc = desc;
        this.price = price;
        this.imgSrc = imgSrc
    };

    Product.prototype.getAmount = function () {
        this.amount = this.qty * this.price;
        return this.amount;
    }

    let productInfo = function () {
        return {
            11: new Product(11, 'Strawberry', 'Strawberries are sweet and red', 3, 'images/strawberry.png'),
            13: new Product(13, 'Onions', 'Onions are a veggie and usually fresh', 5, 'images/onions.png'),
            15: new Product(15, 'Potato', 'Potato are a the most used veggie', 4, 'images/potato.png'),
            17: new Product(17, 'Tomato', 'Tomato are used to make Ketchup', 6, 'images/tomato.png'),
        }

    }

    let getProduct = function (productId) {
        const allProducts = productInfo();
        return allProducts[productId]
    }

    return {
        productInfo: productInfo,
        getProduct: getProduct
    }

})();


let cartUiController = (function (productCtrl) {

    let getDomStrings = {
        productGrid: '.products-grid',
        addToCart: 'add-to-cart',
        productQty: '.product-quantity',
        cartQty: '#cart-qty',
        cartSubtotal: '#cart-subtotal',
        cartTax: '#cart-tax',
        cartTotal: '#cart-total',
        cartProducts: '.cart-products',
        deleteButton: '.delete-btn',
        deleteButtonClass: 'delete-btn',
        increaseQty: '.plus-btn',
        decreaseQty: '.minus-btn',
        shoppingCart: '.shopping-cart',

    }

    let getProductDetails = function (clickedItem) {
        let productId, product;
        productId = getProductId(clickedItem);
        product = productCtrl.getProduct(productId);
        product.qty = getProductQty(clickedItem);

        return product;
    }

    let getProductId = function (clickedItem) {
        let productId;
        // Get Product id
        productId = clickedItem.parentNode.parentNode.parentNode.parentNode.id;
        return productId.split('-').pop();
    }

    let getProductQty = function (clickedItem) {
        // Get Product Qty
        return parseInt(
            clickedItem
                .parentNode
                .parentNode
                .children[0]
                .children[0]
                .value
        );
    }

    let updateCartTotals = function (cart) {
        document.querySelector(getDomStrings.cartQty).textContent = cart.totalQty;
        document.querySelector(getDomStrings.cartSubtotal).textContent = cart.subTotal;
        document.querySelector(getDomStrings.cartTax).textContent = cart.taxAmount;
        document.querySelector(getDomStrings.cartTotal).textContent = cart.totalAmount;
    }

    let getCartItemHtml = function (product) {
        return `<div class="item" data-id="${product.id}">
                        <div class="buttons">
                            <span class="delete-btn"></span>
                            <span class="like-btn"></span>
                        </div>
                        <div class="image">
                            <img src="${product.imgSrc}" alt="${product.name}"/>
                        </div>
                        <div class="description">
                            <span>${product.name}</span>
                            <span>
                                <span class="at-the-rate">@ </span>
                                <span class="currency">$</span>
                                <span class="price">${product.price}</span>
                            </span>
                        </div>

                        <div class="quantity">
                            <button class="plus-btn" type="button" name="button">
                                <img src="images/plus.svg" alt=""/>
                            </button>
                            <input type="text" name="name" value="${product.qty}">
                            <button class="minus-btn" type="button" name="button">
                                <img src="images/minus.svg" alt=""/>
                            </button>
                        </div>

                        <div class="total-price">${product.getAmount()}</div>
                    </div>`;


    }

    let updateProductsList = function (cart) {

        let markup, product;

        markup = (typeof markup === undefined) ? markup : '';

        for (let i = 0; i < cart.products.length; i++) {
            product = cart.products[i];
            markup = markup + getCartItemHtml(product);
        }

        document.querySelector(getDomStrings.cartProducts).innerHTML = markup;

    }

    let clearCart = function (cart) {

        updateProductsList(cart);
        updateCartTotals(cart);

    }

    let updateCart = function (cart) {
        updateProductsList(cart);
        updateCartTotals(cart);

    }


    return {
        getProductDetails: getProductDetails,
        getDomStrings: getDomStrings,
        getProductId: getProductId,
        updateCart: updateCart,
        clearCart: clearCart
    }

})(cartProductController);

let cartDataController = (function () {

    const taxPercent = 10;
    const cartMinQty = -1;
    const cartMaxQty = -1;

    let cart = {
        products: [],
        productsId: [],
        subTotal: 0,
        taxAmount: 0,
        totalAmount: 0,
        totalQty: 0,
    }

    let findCartIndex = function (productId) {
        for (let i = 0; i < cart.products.length; i++) {
            if (productId === cart.products[i].id) {
                return i;
            }
        }

    }


    let addToCart = function (productDetail) {
        // productDetail = { id: 11, name: "Strawberry", desc: "Strawberries are sweet and red", price: 3, qty: "2" }

        let productIndex;

        // check if the cart is already maxCartQty
        if (-1 !== cartMaxQty) {
            if (cart.totalQty >= cartMaxQty) {
                alert('Cart already full');
                return cart;
            }
        }


        // Check if the product is already in cart
        if (-1 !== cart.productsId.indexOf(productDetail.id)) {
            // if Yes: update that product
            // console.warn('Product already in Cart');
            productIndex = findCartIndex(productDetail.id);

            // update individual product
            cart.products[productIndex].qty += productDetail.qty;
            cart.products[productIndex].amount += productDetail.getAmount();
            // console.warn('individual product updated');

        } else {
            // if no: add new product to cart
            productIndex = productDetail.id;
            // // update products list
            cart.products.push(productDetail);
            // // update id list
            cart.productsId.push(productDetail.id);
        }

        // update TotalAmount, Qty, subTotal, tax,
        // update Subtotal
        cart.subTotal += productDetail.qty * productDetail.price;
        // update tax
        cart.taxAmount = cart.subTotal * taxPercent / 100;
        // update Total
        cart.totalAmount = cart.subTotal + cart.taxAmount;
        // update cart Qty
        cart.totalQty += productDetail.qty;

        // Remove duplicates from the products id array
        cart.productsId = [...new Set(cart.productsId)];

        // return cart
        return cart;

    }

    let getCart = function () {
        return cart;
    }


    return {
        addToCart: addToCart,
        getCart: getCart
    }

})();

let controller = (function (
    dataCtrl,
    UICtrl,
    productCtrl
) {

    let domStrings, clickedItem;
    domStrings = UICtrl.getDomStrings;

    let ctrlAddToCart = function () {
        let cart, productDetails;

        // Get Product details
        productDetails = UICtrl.getProductDetails(clickedItem);

        // Update Cart Data structure
        cart = dataCtrl.addToCart(productDetails);

        // Update cart UI
        UICtrl.updateCart(cart);


    }

    let addToCartListener = function () {
        document.querySelector(domStrings.productGrid).addEventListener('click', function (e) {
            const target = e.target;
            if (target.classList.contains(domStrings.addToCart)) {
                // console.warn('Add To Cart clicked!');

                clickedItem = target;
                ctrlAddToCart();

            }
        });
    }

    let removeProductListener = function () {

        document.querySelector(domStrings.shoppingCart).addEventListener('click', function (e) {
            const target = e.target;
            console.warn('Remove Button clicked!');
            console.log(domStrings.deleteButtonClass);
            console.log(target.classList.contains(domStrings.deleteButtonClass));

            if (target.classList.contains(domStrings.deleteButtonClass)) {
                console.warn('inside: Remove Button clicked!');
                clickedItem = target;
                // ctrlAddToCart();
            }
        });


    }

    let setupEventListener = function () {
        addToCartListener();
        removeProductListener();
    }

    let init = function () {
        console.log('Application initialized');

        UICtrl.clearCart(dataCtrl.getCart());
        setupEventListener();
    }

    return {
        init: init
    }


})(cartDataController, cartUiController, cartProductController);


controller.init();