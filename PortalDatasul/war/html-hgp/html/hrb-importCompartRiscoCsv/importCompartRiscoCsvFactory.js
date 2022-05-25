define(['index', 
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {
    
    importCompartRiscoCsvFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
    function importCompartRiscoCsvFactory($totvsresource, dtsUtils) {

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/thf/hrb/fchsauimportcompartriscocsv/:method/:id', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}, headers: {enctype:'multipart/form-data'}}            
        });

        factory.importCompartRiscoCsv = function (parametros, rpw, callback) {
            factory.TOTVSPost({method: 'importCompartRiscoCsv'},
                                {tmpParametros: parametros, tmpPedidosRpw: rpw},
                                callback);
        };
        
        return factory;
}

index.register.factory('hrb.importCompartRiscoCsv.Factory', importCompartRiscoCsvFactory);	
});


