define(['index', '/dts/kbn/js/factories/kbn-factories.js'], function(index) {

    factoryZoomWorkcenter.$inject = ['kbn.helper.FactoryLoader', 'kbn.generic.Factory', 'kbn.generic-crud.Factory', 'kbn.typeahead.Factory'];

    function factoryZoomWorkcenter(factoryResource, kbnGenericFactory, kbnGenericCrud, typeaheadFactory) {

        var specificResources = {
            transferCentroTrabalho: {
                method: 'POST',
                isArray: false,
                params: {
                    url: 'transferCentroTrabalho'
                }
            }
        };

        var factory = factoryResource.loadSpecificResources('/dts/datasul-rest/resources/api/fch/fchkb/fchkbzoomctmestre', specificResources);
        angular.extend(factory, kbnGenericFactory);
        angular.extend(factory, kbnGenericCrud);
        angular.extend(factory, typeaheadFactory);
        return factory;
    }
    index.register.factory('kbn.workcenter-zoom.Factory', factoryZoomWorkcenter);
});
