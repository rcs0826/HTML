define(['index', '/dts/kbn/js/factories/kbn-factories.js'], function(index) {

    cellupdateFactory.$inject = ['kbn.helper.FactoryLoader', 'kbn.generic.Factory', 'kbn.generic-crud.Factory', 'kbn.typeahead.Factory'];

    function cellupdateFactory(factoryResource, kbnGenericFactory, kbnGenericCrud, typeaheadFactory) {

        var specificResources  = {

            listCell:{
                method: 'GET',
                isArray: true,
                params: {
                    url: 'listCell'
                }
            },
            saveCellUpdate:{
                method: 'POST',
                isArray: false,
                params: {
                    url: 'saveCell'
                }
            },
            celulasMapeamento: {
                method: 'GET',
                isArray: true,
                params: {
                    url: 'celulasMapeamento'
                }
            }
        };

        var factory = factoryResource.loadSpecificResources('/dts/datasul-rest/resources/api/fch/fchkb/fchkbcell', specificResources);
        angular.extend(factory, kbnGenericFactory);
        angular.extend(factory, kbnGenericCrud);
        angular.extend(factory, typeaheadFactory);
        return factory;
    }
    index.register.factory('kbn.cellupdate.Factory', cellupdateFactory);
});
