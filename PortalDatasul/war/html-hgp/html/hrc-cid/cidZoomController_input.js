define(['index',
    'dtshrc/html/document/documentFactory.js',
    '/dts/hgp/html/js/util/StringTools.js'
], function (index) {

    cidZoomController.$inject = ['$injector', 'hrc.document.Factory', '$q'];
    function cidZoomController($injector, documentFactory, $q) {

        var _self = this;

        this.zoomName = 'CID';
        this.propertyFields = [
            {label: 'Código', property: 'cdCid'},
            {label: 'Descrição', property: 'dsDoenca', default: true}
        ];
        this.tableHeader = [
            {label: 'Código', property: 'cdCid'},
            {label: 'Descrição', property: 'dsDoenca'}
        ];
        this.searchFunction = documentFactory.getCidByFilter;
	this.codeVar        = 'cdCid';
	this.descriptionVar = 'dsDoenca';
        
	this.itemResult = {};
        this.zoomResultList = [];
        this.resultTotal = 0;
        
        var _self = this;
        
        this.initialize = function(){
            
            if(angular.isUndefined(_self.searchCodeVar)){
                _self.searchCodeVar = this.codeVar;
            }
            
            if(angular.isUndefined(_self.searchDescVar)){
                _self.searchDescVar = this.descriptionVar;
            }
            
            if(angular.isUndefined(_self.minCodeLength)){
                _self.minCodeLength = 0;
            }
            
            if(angular.isUndefined(_self.minDescLength)){
                _self.minDescLength = 0;
            }
        };
        
        this.returnValue = function () {
            return this.$selected[this.codeVar] + " - " + this.$selected[this.descriptionVar];
        };
        
        this.getItemResult = function(){
            var resultAux = angular.copy(_self.itemResult);
            _self.itemResult = {};
            return resultAux;
        };
        
        this.getObjectFromValue = function (value) {
            var propertyName = _self.searchCodeVar;
            if (value.length > 4) {
                propertyName = _self.searchDescVar;
            }

            _self.itemResult = {};

            var deferred = $q.defer();
            this.searchFunction('', 0, 5,
                    [{property: propertyName,
                            value: value}],
                function (result) {
                    if (result && result.length === 1){
                        _self.itemResult = result[0];
                        deferred.resolve(_self.itemResult);
                    }
                    
                });

            return deferred.promise;
        };
        
        this.applyFilter = function (parameters) {
            
            if (parameters.more === true) {
                parameters.init = this.zoomResultList.length;
            } else {
                this.zoomResultList.length = 0;
                parameters.init = 0;
            }

            var _self = this;
            this.searchFunction('', parameters.init, 100,
                    [{property: parameters.selectedFilter.property,
                            value: parameters.selectedFilterValue}],
                function (result) {
                    if (result) {
                        _self.resultTotal = result.length;
                        _self.zoomResultList = result;
                    }
                });
        };
        
        this.initialize();

        return this;
        
    }

    index.register.factory('hrc.cidZoomController', cidZoomController);

});
