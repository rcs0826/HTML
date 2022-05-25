define([
    'index'
], function(index) {
    
    // ########################################################
    // ### Factories
    // ########################################################    
    function factoryCurrency($totvsresource) {
        var specificResources = { // Retorna as moedas cadastradas
            'getCurrencies': {
                method: 'GET',
                isArray: true,
                url: '/dts/datasul-rest/resources/api/ccp/ccapi353/getCurrencies/',
                params: {}
            }     
        };  
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/ccp/ccapi353', {}, specificResources);
        
        return factory; 
    }
 
    // ########################################################
    // ### Registers
    // ######################################################## 
    index.register.factory('mcc.ccapi353.Factory', factoryCurrency);
});
