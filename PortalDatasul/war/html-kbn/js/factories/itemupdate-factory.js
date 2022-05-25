define(['index', '/dts/kbn/js/factories/kbn-factories.js'], function(index) {

    itemupdateFactory.$inject = ['kbn.helper.FactoryLoader', 'kbn.generic.Factory', 'kbn.generic-crud.Factory', 'kbn.typeahead.Factory'];

    function itemupdateFactory(factoryResource, kbnGenericFactory, kbnGenericCrud, typeaheadFactory) {

        var specificResources  = {

            listItem:{
                method: 'GET',
                isArray: true,
                params: {
                    url: 'listItem'
                }
            },
            saveItemUpdate:{
                method: 'POST',
                isArray: false,
                params: {
                    url: 'saveItem'
                }
            }
        };

        var factory = factoryResource.loadSpecificResources('/dts/datasul-rest/resources/api/fch/fchkb/fchkbitem', specificResources);
        angular.extend(factory, kbnGenericFactory);
        angular.extend(factory, kbnGenericCrud);
        angular.extend(factory, typeaheadFactory);
        return factory;
    }
    index.register.factory('kbn.itemupdate.Factory', itemupdateFactory);
});
