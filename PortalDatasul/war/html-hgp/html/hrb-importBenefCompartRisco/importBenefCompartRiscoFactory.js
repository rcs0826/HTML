define(['index', 
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {
    
    importBenefCompartRiscoFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
    function importBenefCompartRiscoFactory($totvsresource, dtsUtils) {

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/thf/hrb/fchsauimportbenefcompartrisco/:method/:id', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}, headers: {enctype:'multipart/form-data'}}            
        });

        factory.importBenefCompartRisco = function (parametros, rpw, callback) {
            factory.TOTVSPost({method: 'importBenefCompartRisco'},
                                {tmpParametros: parametros, tmpPedidosRpw: rpw},
                                callback);
        };
        
        return factory;
}

index.register.factory('hrb.importBenefCompartRisco.Factory', importBenefCompartRiscoFactory);	
});


