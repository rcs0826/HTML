define(['index', 
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {
    
    geracaoDemonstrativoContabilFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
    function geracaoDemonstrativoContabilFactory($totvsresource, dtsUtils) {

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/thf/hfp/fchsaugeracaodemonstrativocontabil/:method/:id', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}, headers: {enctype:'multipart/form-data'}}            
        });

        factory.getQuery = function (cMethod, callback) {
            factory.TOTVSQuery({method: cMethod},
                                callback);
        };        

        factory.generatePasscode = function (parametros, rpw, callback) {
            factory.TOTVSPost({method: 'generatePasscode'},
                              {tmpParametros: parametros, 
                               tmpPedidosRpw: rpw},
                              callback);
        };
        
        return factory;
    } 

    index.register.factory('hfp.geracaoDemonstrativoContabil.Factory', geracaoDemonstrativoContabilFactory);	
});


