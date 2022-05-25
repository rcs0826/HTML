define(['index', 
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {

    saldosProvisaoReceitaFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
	function saldosProvisaoReceitaFactory($totvsresource, dtsUtils) {
		
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/thf/hfp/fchsausaldosprovisaoreceita/:method/:id', {},{             
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}, headers: {enctype:'multipart/form-data'}}

        });

        factory.generatePasscode = function (parametros, rpw, callback) {
            factory.TOTVSPost({method: 'generatePasscode'},
                              {tmpParametros: parametros, 
                               tmpPedidosRpw: rpw},
                              callback);
        };

        return factory;
    }

    index.register.factory('hfp.saldosProvisaoReceita.Factory', saldosProvisaoReceitaFactory);
});