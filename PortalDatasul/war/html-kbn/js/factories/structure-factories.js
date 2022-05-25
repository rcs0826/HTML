
define(['index', '/dts/kbn/js/factories/kbn-factories.js'], function(index) {
	factoryStructure.$inject = ['kbn.generic.Factory', 'kbn.helper.FactoryLoader'];
	function factoryStructure(kbnGenericFactory, factoryResource) {

		var specificResources = {
			getStructures: {
				method: 'POST',
				isArray: false,
				params: {
					url: 'getInputItems'
				}
			}
		};

		var factory = factoryResource.loadSpecificResources('/dts/datasul-rest/resources/api/fch/fchkb/fchkbitemservice', specificResources);

		angular.extend(factory, kbnGenericFactory);
		return factory;
	}

    index.register.factory('kbn.structure.Factory', factoryStructure);
});