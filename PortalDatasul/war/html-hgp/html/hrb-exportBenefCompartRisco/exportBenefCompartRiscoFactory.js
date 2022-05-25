define(['index', 
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {
    
    exportBenefCompartRiscoFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
    function exportBenefCompartRiscoFactory($totvsresource, dtsUtils) {

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/thf/hrb/fchsauexportbenefcompartrisco/:method/:id', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}, headers: {enctype:'multipart/form-data'}}            
        });

        factory.exportBenefCompartRisco = function (parametros, rpw, callback) {
            factory.TOTVSPost({method: 'exportBenefCompartRisco'},
                                {tmpParametros: parametros, tmpPedidosRpw: rpw},
                                callback);
        };
        
        return factory;
}

index.register.factory('hrb.exportBenefCompartRisco.Factory', exportBenefCompartRiscoFactory);	
});


