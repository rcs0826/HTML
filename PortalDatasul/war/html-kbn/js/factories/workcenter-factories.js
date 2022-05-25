
define(['index', '/dts/kbn/js/factories/kbn-factories.js'], function(index) {

	factoryWorkCenter.$inject = ['kbn.helper.FactoryLoader', 'kbn.generic.Factory', 'kbn.generic-crud.Factory'];

	function factoryWorkCenter(factoryResource, kbnGenericFactory, kbnGenericCrud) {

		var specificResources = {
			getWorkcenters: {
				method: 'POST',
				isArray: true,
				params: {
					url: 'getWorkCentersByGM'
				}
			}
		};

		var factory = factoryResource.loadSpecificResources('/dts/datasul-rest/resources/api/fch/fchkb/fchkbworkcenterservice', specificResources);

		angular.extend(factory, kbnGenericFactory);
		angular.extend(factory, kbnGenericCrud);
		return factory;
	}

    index.register.factory('kbn.workcenter.Factory', factoryWorkCenter);

});