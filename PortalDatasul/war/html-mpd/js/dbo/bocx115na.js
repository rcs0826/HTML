define(['index'], function(index) {
    bocx115naFactory.$inject = ['$totvsresource'];
    function bocx115naFactory($totvsresource) {
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/dbo/cxbo/bocx115na/:method/:id',{}, {});

        factory.getRecord = function (id, callback) {
            return this.TOTVSGet({id: id}, callback);
        };
        
        return factory;
    }
         
    index.register.factory('mpd.bocx115na.Factory', bocx115naFactory); 
});
