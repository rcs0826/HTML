define(['index'], function(index) {
    // *************************************************************************************
    // *** FACTORIES
    // *************************************************************************************
    fchdis0052Factory.$inject = ['$totvsresource'];
    function fchdis0052Factory($totvsresource) {
         
        var specificResources = {
            'getConfigurations':	{
				method: 'GET',
				isArray: true,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0052/configuration'
			},
            'addConfiguration':	{
				method: 'POST',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0052/configuration'
			},
            'deleteConfiguration':	{
				method: 'DELETE',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0052/configuration/:idiSeq'
			},
            'getConfigurationsFields':	{
				method: 'GET',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0052/configurationfields/:idiSeq'
			},
            'saveConfigurationsFields':	{
				method: 'POST',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0052/configurationfields/:idiSeq'
			},
            'newConfigurationModel':	{
				method: 'GET',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0052/newconfigurationmodel'
			},
            'getConfigurationsModels':	{
				method: 'GET',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0052/configurationmodels/:idiSeq'
			},
            'saveConfigurationsModels':	{
				method: 'POST',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0052/configurationmodels/:idiSeq'
			},
            'deleteConfigurationsModel':	{
				method: 'DELETE',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0052/configurationmodel/:idiSeq'
			}


        };
       
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchdis/fchdis0052',{}, specificResources);

        return factory;
    }    
         
    index.register.factory('mpd.fchdis0052.Factory', fchdis0052Factory);     
});
