define(['index'], function(index) {
    // *************************************************************************************
    // *** FACTORIES
    // *************************************************************************************
    bodi388naFactory.$inject = ['$totvsresource'];
    function     bodi388naFactory($totvsresource) {
         
        var specificResources = {
        }
       
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/dbo/dibo/bodi388na',{}, specificResources);
         
        return factory;
    }    
         
    index.register.factory('mpd.bodi388na.Factory',     bodi388naFactory);     
});