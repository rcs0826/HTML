define(['index', 
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {
    
    relatPeonaFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
    function relatPeonaFactory($totvsresource, dtsUtils) {

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hpp/fchsaurelatpeona/:method/:id', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}, headers: {enctype:'multipart/form-data'}}            
        });

        factory.scheduleRpw = function (parametros, rpw, callback) {
            factory.TOTVSPost({method: 'scheduleRpw'},
                                {tmpParametros: parametros, tmpPedidosRpw: rpw},
                                callback);
        };
        
        
        return factory;
}

index.register.factory('hpp.relatPeona.Factory', relatPeonaFactory);	
});


