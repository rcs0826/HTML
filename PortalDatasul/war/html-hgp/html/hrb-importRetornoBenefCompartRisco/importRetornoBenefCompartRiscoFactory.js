define(['index', 
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {
    
    importRetornoBenefCompartRisco.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
    function importRetornoBenefCompartRisco($totvsresource, dtsUtils) {

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/thf/hrb/fchsauimportretornobenefcompartrisco/:method/:id', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}, headers: {enctype:'multipart/form-data'}}            
        });

        factory.importRetornoBenefCompartRisco = function (parametros, rpw, callback) {
            factory.TOTVSPost({method: 'importRetornoBenefCompartRisco'},
                                {tmpParametros: parametros, tmpPedidosRpw: rpw},
                                callback);
        };
        
        return factory;
}

index.register.factory('hrb.importRetornoBenefCompartRisco.Factory', importRetornoBenefCompartRisco);	
});


