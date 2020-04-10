let cartProductController = (function () {

    let Product = function (id, name, desc, price) {
        this.id = id;
        this.name = name;
        this.desc = desc;
        this.price = price;
    };

    Product.prototype.amount = function () {
        this.amount = this.qty * this.price;
        return this.amount;
    }

    let productInfo = function () {
        return {
            11: new Product(11, 'Strawberry', 'Strawberries are sweet and red', 3),
            13: new Product(13, 'Onions', 'Onions are a veggie and usually fresh', 5),
            15: new Product(15, 'Potato', 'Potato are a the most used veggie', 4),
            17: new Product(17, 'Tomato', 'Tomato are used to make Ketchup', 6),
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

    let getDomStrings = function () {
        return {
            productGrid: '.products-grid',
            addToCart: 'add-to-cart',
            productQty: '.product-quantity'
        }
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
        return parseInt(clickedItem.parentNode.parentNode.children[0].children[0].value);
    }


    return {
        getProductDetails: getProductDetails,
        getDomStrings: getDomStrings,
        getProductId: getProductId
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
            if (productId === cart.products[productId].id) {
                return productId;
            }
        }

    }


    let addToCart = function (productDetail) {
        // productDetail = { id: 11, name: "Strawberry", desc: "Strawberries are sweet and red", price: 3, qty: "2" }
        console.warn(productDetail);

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
            console.warn('Product already in Cart');
           productIndex = findCartIndex(productDetail.id);
            console.warn(productIndex)
        } else {
            // if no: add new product to cart
            productIndex = productDetail.id;
            // // update products list
            // cart.products[productIndex] = productDetail;
            // // update id list
            // cart.productsId.push(productIndex);
            // // update Subtotal
            // cart.subTotal += productDetail.amount();
            // // update tax
            // cart.tax = cart.subTotal * taxPercent / 100;
            // // update Total
            // cart.totalAmount = cart.subTotal + cart.tax;
            // // update cart Qty
            // cart.totalQty += productDetail.qty;
        }


        // update products list
        cart.products[productIndex] = productDetail;
        // update id list
        cart.productsId.push(productIndex);
        // update Subtotal
        cart.subTotal += productDetail.amount();
        // update tax
        cart.taxAmount = cart.subTotal * taxPercent / 100;
        // update Total
        cart.totalAmount = cart.subTotal + cart.taxAmount;
        // update cart Qty
        cart.totalQty += productDetail.qty;

        cart.productsId = [...new Set(cart.productsId)];


        // update TotalAmount, Qty, subTotal, tax,

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
    domStrings = UICtrl.getDomStrings();

    let ctrlAddToCart = function () {
        let cart, productDetails;
        productDetails = UICtrl.getProductDetails(clickedItem);
        cart = dataCtrl.addToCart(productDetails);

        console.log(cart);


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

    let setupEventListener = function () {
        addToCartListener();

    }

    let init = function () {
        console.log('Application initialized');
        setupEventListener();
    }

    return {
        init: init
    }


})(cartDataController, cartUiController, cartProductController);


controller.init();