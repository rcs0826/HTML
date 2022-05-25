define(['index'], function(index) {
    // *************************************************************************************
    // *** FACTORIES
    // *************************************************************************************
	cfapi004Factory.$inject = ['$totvsresource', 'ReportService'];
    function cfapi004Factory($totvsresource, ReportService) {
         
		var specificResources = {
			'narrative': {
				method: 'GET',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/cfp/cfapi004/narrativa',
			}
		};

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/cfp/cfapi004',{}, specificResources);
         
        return factory;
    }    
         
	index.register.factory('mpd.cfapi004.Factory', cfapi004Factory); 
});

