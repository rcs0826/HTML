define(['index', 
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {
    
    identificaCompartRiscoFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
    function identificaCompartRiscoFactory($totvsresource, dtsUtils) {

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/thf/hrb/fchsauidentificacompartrisco/:method/:id', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}, headers: {enctype:'multipart/form-data'}}            
        });

        factory.getInitialTemps = function (callback) {
            factory.TOTVSGet({method: 'getInitialTemps'},                            
                              callback);
        };        

        factory.getQuery = function (cMethod, callback) {
            factory.TOTVSQuery({method: cMethod},
                                callback);
        };        

        factory.generatePasscode = function (parametros, rpw, tmpUnidade, tmpTpPlano, tmpTpContrat, callback) {
            factory.TOTVSPost({method: 'generatePasscode'},
                              {tmpParametros: parametros, 
                               tmpPedidosRpw: rpw,
                               tmpUnidade: tmpUnidade,
                               tmpTpPlano: tmpTpPlano,
                               tmpTpContrat: tmpTpContrat},
                              callback);
        };
        
        return factory;
    }

    index.register.factory('hrb.identificaCompartRisco.Factory', identificaCompartRiscoFactory);	
});


