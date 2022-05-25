define(['index',
    '/healthcare/hrc/html/document/documentFactory.js',
    '/healthcare/js/util/StringTools.js'
], function (index) {

    transactionZoomController.$inject = ['$injector', 'hrc.document.Factory', '$q'];
    function transactionZoomController($injector, documentFactory, $q) {

        var _self = this;

        this.zoomResultList = [];
        this.resultTotal = 0;
        this.zoomName = 'Transação';
        this.propertyFields = [
            {label: 'Código', property: 'cdTransacao'},
            {label: 'Descrição', property: 'dsTransacao', default: true}
        ];
        this.tableHeader = [
            {label: 'Código', property: 'cdTransacao'},
            {label: 'Descrição', property: 'dsTransacao'}
        ];
        this.returnValue = function () {
            var itemSelected = this.zoomResultList[this.selected];
            return itemSelected['cdTransacao'] + " - " + itemSelected['dsTransacao'];
        };
        this.getObjectFromValue = function (value) {  
            var propertyName = 'dsTransacao';
            if (StringTools.hasOnlyNumbers(value)) {
                propertyName = 'cdTransacao';
            }
            
            _self.itemResult = {};

            var deferred = $q.defer();
            documentFactory.getTransactionByFilter('', 0, 5,
                    [{property: propertyName,
                            value: value}],
                function (result) {
                    if (result){
                        if(result.length === 1){
                            if (!angular.isUndefined(result[0])) {
                                _self.itemResult = result[0];
                                console.log(_self.itemResult);
                            }
                        }else{
                            angular.forEach(result, function(item){
                            });  
                        }
                    } 

                    deferred.resolve(_self.itemResult);
                });
            return deferred.promise;
            
//            return $http.post('/healthmanagementwebservices/rest/hrc/document/getTransactionByFilter',
//                    {simpleFilterValue: '', pageOffset: 0, limit: 0, 
//                     disclaimers: [{property: 'cdTransacao', value:'8002' }] }, 
//                    {isArray: true}
//                  ).then(function successCallback(response) {
//                      console.log('akiii');
//                      console.log(response);
//                      return response.data[0];
//                    }, function errorCallback(response) {
//                      console.log('errooo');
//                      console.log(response);
//                    });
        };

        this.applyFilter = function (parameters) {

            if (parameters.more === true) {
                parameters.init = this.zoomResultList.length;
            } else {
                this.zoomResultList.splice(0, this.zoomResultList.length);
                parameters.init = 0;
            }
            
            var controller = this;
            documentFactory.getTransactionByFilter('', parameters.init, 100,
                    [{property: parameters.selectedFilter.property,
                            value: parameters.selectedFilterValue}],
                function (result) {
                    if (result) {
                        controller.resultTotal = result.length;
                        controller.zoomResultList = result;
                    }
                });
        };

        return this;
    }

    index.register.factory('hrc.transactionZoomController__', transactionZoomController);

});
