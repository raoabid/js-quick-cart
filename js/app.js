let cartUiController =(function () {

})();

let cartDataController =(function () {

})();

let controller =(function (dataCtrl, UICtrl) {

    let init = function () {

        console.log('Application initialized');

    }

    return {
        init: init
    }


})(cartDataController, cartUiController);


controller.init();