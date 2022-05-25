
define(['index', '/dts/kbn/js/factories/kbn-factories.js'], function(index) {

	factoryItemERP.$inject = ['kbn.helper.FactoryLoader', 'kbn.generic.Factory', 'kbn.typeahead.Factory'];

	function factoryItemERP(factoryResourceLoader, genericFactory, typeaheadFactory, zoomFactory) {

		var specificResources = {
				getItens: {
					method: 'POST',
					isArray: false,
					params: {
						url: 'getItens'
					}
				}
		};

		var factory = factoryResourceLoader.loadSpecificResources('/dts/datasul-rest/resources/api/fch/fchkb/fchkbitemservice', specificResources);
		angular.extend(factory, genericFactory);
		angular.extend(factory, typeaheadFactory);
		return factory;
	}
	
	index.register.factory('kbn.itemERP.Factory', factoryItemERP);
});