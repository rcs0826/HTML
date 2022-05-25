define([
	'index',
	'/dts/mcc/js/mcc-utils.js'
], function(index) {
	
	// ########################################################
	// ### Factories
	// ########################################################
    factoryFollowUp.$inject = ['$totvsresource'];
    function factoryFollowUp($totvsresource) {        
        var specificResources = {
            'getFollowUp': { // Retorna os follow-up's de um documento
                method: 'GET',
                isArray: true,
                params: {},
                url: '/dts/datasul-rest/resources/api/ccp/ccapi355/getFollowUp/'
            },
            'addFollowUp': { // Criar um follow-up
                method: 'POST',
                isArray: false,
                params: {},
                url: '/dts/datasul-rest/resources/api/ccp/ccapi355/addFollowUp/'   
            }
        }    

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/ccp/ccapi355', {}, specificResources);
        return factory;
    };

	// ########################################################
	// ### Registers
	// ########################################################	
    index.register.factory('mcc.ccapi355.Factory', factoryFollowUp);
});
