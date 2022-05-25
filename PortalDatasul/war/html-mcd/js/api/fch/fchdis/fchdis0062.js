define(['index'], function(index) {
    // *************************************************************************************
    // *** FACTORIES
    // *************************************************************************************
    relatPriceTableEstabFactory.$inject = ['$totvsresource'];
    function relatPriceTableEstabFactory($totvsresource) {
         
        var specificResources = {
            'getRelatPricerTableEstab': {
                method: 'GET',
                isArray: false,
                params: {},
                url: '/dts/datasul-rest/resources/prg/cdp/v1/relatpricetableestab'
            },
            'getTableEstab':	{
				method: 'GET',
                isArray: false,
                params: {estabelecId: '@estabelecId'},
                url: '/dts/datasul-rest/resources/prg/cdp/v1/relatpricetableestab/edit/:estabelecId'
            },
            'postTableEstab': {
                method: 'POST',
                isArray: true,
                params: {estabelecId: '@estabelecId'},
                url: '/dts/datasul-rest/resources/prg/cdp/v1/relatpricetableestab/:estabelecId'
            },
            'deleteTableEstab': {
                method: 'PUT',
                isArray: false,
                params: {estabelecId: '@estabelecId'},
                url: '/dts/datasul-rest/resources/prg/cdp/v1/relatpricetableestab/:estabelecId'
            }
        }
       
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchdis/fchutils0062', {}, specificResources);
         
        return factory;
    }
         
    index.register.factory('mcd.relatpricetableestab.Factory', relatPriceTableEstabFactory);
   
    
});