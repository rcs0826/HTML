define(['index', 
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {
    
    processaBaixaAvisoFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
    function processaBaixaAvisoFactory($totvsresource, dtsUtils) {

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/thf/hrc/fchsaurpwprocessabaixaaviso/:method/:id', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}, headers: {enctype:'multipart/form-data'}}            
        });

        factory.processaBaixaAviso = function (parametros, rpw, callback) {
            factory.TOTVSPost({method: 'processaBaixaAviso'},
                                {tmpParametros: parametros, tmpPedidosRpw: rpw},
                                callback);
        };
        
        return factory;
}

index.register.factory('hrc.processaBaixaAviso.Factory', processaBaixaAvisoFactory);	
});
