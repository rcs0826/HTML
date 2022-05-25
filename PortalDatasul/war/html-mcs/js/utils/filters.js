define(['index'], function(index) {
    
    index.register.filter('quantityMask', function() {
        return function (input) {
            input = parseFloat(Math.round(input * 100) / 100).toFixed(2).toString();
            
            var inteiro = 0;
            var decimal = 0;
            
            inteiro = input.split(".")[0];
            decimal = input.split(".")[1];
            
            if (inteiro.length > 7) {
                inteiro = inteiro.match(/(\d{7})/g, '');
            }
            
            if (decimal.length > 2) {
                decimal = decimal.match(/(\d{2})/g, '');
            }
            
            return inteiro + "." + decimal;
        };
    });
    
    index.register.filter('periodFilter', function(){
        return function (input) {return input.replace('?9?99/9999', '')};
    });
});