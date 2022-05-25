define(['index', '/dts/kbn/js/factories/kbn-factories.js'], function(index) {

    factorycards.$inject = ['kbn.helper.FactoryLoader', 'kbn.generic.Factory', 'kbn.generic-crud.Factory', 'kbn.typeahead.Factory'];

    function factorycards(factoryResource, kbnGenericFactory, kbnGenericCrud, typeaheadFactory) {

        var specificResources  = {

            getCards:{
                method: 'GET',
                isArray: true,
                params: {
                    url: 'cards'
                }
            },
            cardMovement: {
                method: 'POST',
                isArray: false,
                params: {
                    url: 'cardMovement'
                }
            },
            getItemCard: {
                method: 'GET',
                isArray: true,
                params: {
                    url: 'getItemCard'
                }
            },
            inventoryAdjustment: {
                method: 'GET',
                isArray: false,
                params: {
                    url: 'inventoryAdjustment'
                }
            },
            ConsumeCards: {
                method: 'POST',
                isArray: false,
                params: {
                    url: 'ConsumeCards'
                }
            },
            getProcessExceptions: {
                method: 'POST',
                isArray: true,
                params: {
                    url: 'getProcessExceptions'
                }
            },
            getProcessExceptionsItemDetail: {
                method: 'POST',
                isArray: true,
                params: {
                    url: 'getProcessExceptionsItemDetail'
                }
            },
            dashboardProcessExceptions:{
                method: 'POST',
                isArray: true,
                params: {
                    url: 'dashboardProcessExceptions'
                }
            },
            dashboardProcessExceptionsDetail:{
                method: 'POST',
                isArray: true,
                params: {
                    url: 'dashboardProcessExceptionsItemDetail'
                }
            }
        };

        var factory = factoryResource.loadSpecificResources('/dts/datasul-rest/resources/api/fch/fchkb/fchkbcard', specificResources);
        angular.extend(factory, kbnGenericFactory);
        angular.extend(factory, kbnGenericCrud);
        angular.extend(factory, typeaheadFactory);
        return factory;
    }
    index.register.factory('kbn.cards.Factory', factorycards);
});
