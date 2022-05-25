define(['index', '/dts/kbn/js/factories/kbn-factories.js'], function(index) {

    ctupdateFactory.$inject = ['kbn.helper.FactoryLoader', 'kbn.generic.Factory', 'kbn.generic-crud.Factory', 'kbn.typeahead.Factory'];

    function ctupdateFactory(factoryResource, kbnGenericFactory, kbnGenericCrud, typeaheadFactory) {

        var specificResources  = {

            listCt:{
                method: 'GET',
                isArray: true,
                params: {
                    url: 'listCt'
                }
            },
            editWorkCenter: {
                method: 'POST',
                isArray: false,
                params: {
                    url: 'editWorkCenter'
                }
            }
        };

        var factory = factoryResource.loadSpecificResources('/dts/datasul-rest/resources/api/fch/fchkb/fchkbctmestre', specificResources);
        angular.extend(factory, kbnGenericFactory);
        angular.extend(factory, kbnGenericCrud);
        angular.extend(factory, typeaheadFactory);
        return factory;
    }
    index.register.factory('kbn.ctupdate.Factory', ctupdateFactory);
});