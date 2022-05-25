define(['index', '/dts/kbn/js/factories/kbn-factories.js'], function(index) {

    factoryZoomItem.$inject = ['kbn.helper.FactoryLoader', 'kbn.generic.Factory', 'kbn.generic-crud.Factory', 'kbn.typeahead.Factory'];

    function factoryZoomItem(factoryResource, kbnGenericFactory, kbnGenericCrud, typeaheadFactory) {

        var specificResources = {
			addItensToCell: {
				method: 'POST',
				isArray: false,
				params: {
					url: 'addItensToCell'
				}
			}
		};

        var factory = factoryResource.loadSpecificResources('/dts/datasul-rest/resources/api/fch/fchkb/fchkbzoomitem', specificResources);
        angular.extend(factory, kbnGenericFactory);
        angular.extend(factory, kbnGenericCrud);
        angular.extend(factory, typeaheadFactory);
        return factory;
    }
    index.register.factory('kbn.item-zoom.Factory', factoryZoomItem);
});
