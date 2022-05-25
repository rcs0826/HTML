define(['index', 
        '/dts/hgp/html/util/dts-utils.js',
        'ng-load!ui-file-upload'
       ], function(index) {
    
    eSocialImportaCSVFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service', 'Upload'];
    function eSocialImportaCSVFactory($totvsresource, dtsUtils, Upload) {

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hcg/fchsauimportacsvesocial/:method/:id', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}, headers: {enctype:'multipart/form-data'}},
            'post': { method: 'POST', params: {method:'@method'}, headers: {enctype:'multipart/form-data', 'noCountRequest': 'true'}}
        });


        factory.getConfiguracoesCSV = function (callback) {
            factory.postWithArray({method: 'getConfiguracoesCSV'},
                                {},
                                callback);
        };
        
        factory.importaCSV = function (eSocialImpPar, eSocialConfigCSV, callback) {
            factory.TOTVSPost({method: 'importaCSV'},
                            {tmpESocialImpPar: eSocialImpPar,
                            tmpESocialConfigCSV: eSocialConfigCSV},
                            callback);
        };
        
        return factory;
}

index.register.factory('hcg.eSocialImportaCSV.Factory', eSocialImportaCSVFactory);	
});


