define(['index',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js'
], function (index) {

    documentsAdvancedFilterController.$inject = ['$rootScope', '$scope','$modalInstance','disclaimers', 'AbstractAdvancedFilterController','TOTVSEvent'];
    function documentsAdvancedFilterController($rootScope, $scope, $modalInstance, disclaimers, AbstractAdvancedFilterController,TOTVSEvent) {

        var _self = this;
        this.model = {}; 
        
        this.disclaimers = disclaimers;

        _self.today = new Date();

        this.filtersConfig = [
            {property: 'idImpugdocsRange',      title: 'Código',        modelVar: 'idImpugdocs'     },
            {property: 'nrImpressaoSeqRange',   title: 'Sequência',   modelVar: 'nrImpressaoSeq' },            
            {property: 'lgPadrao',         title: 'Doc padrão',        modelVar: 'lgPadrao'            },
        ];

        this.search = function () {

            var isValid = true;    

            if (   (!angular.isUndefined(_self.model.idImpugdocs.start) && _self.model.idImpugdocs.start !=='')
                && (!angular.isUndefined(_self.model.idImpugdocs.end) && _self.model.idImpugdocs.end !=='')
                && (parseInt(_self.model.idImpugdocs.start)  > parseInt(_self.model.idImpugdocs.end) )){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'ID do documento final deve ser maior que id do documento inicial.'
                });
            }  

            if (   (!angular.isUndefined(_self.model.nrImpressaoSeq.start) && _self.model.nrImpressaoSeq.start !=='')
                && (!angular.isUndefined(_self.model.nrImpressaoSeq.end) && _self.model.nrImpressaoSeq.end !=='')
                && (parseInt(_self.model.nrImpressaoSeq.start) > parseInt(_self.model.nrImpressaoSeq.end) )){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Nro seq impressão final deve ser maior que o nro seq impressão inicial.'
                });
            }   

            if (isValid === true) {          

                var arrayLength = this.disclaimers.length - 1;
                for (var i = arrayLength ; i >= 0 ; i--) {
                    this.disclaimers.splice(i, 1);
                }      
                this.constructDisclaimers();
                $modalInstance.close(this.disclaimers);
            }
        };

        this.changeRange = function (sourceField,observerField) {
            if (angular.isUndefined(_self.model[observerField]) 
            || _self.model[observerField] == ''
            || _self.model[observerField] == _self.model[sourceField]){
                _self.model[observerField] = _self.model[sourceField];        
            }
        };

        this.cancel = function () {
            
            $modalInstance.dismiss('cancel');
        };

        this.init = function () {

             this.initialize();
        };

        $scope.$watch('$viewContentLoaded', function () {
            
            _self.init();
        });

        $.extend(this, AbstractAdvancedFilterController);
    }

    index.register.controller('hrs.documentsAdvFilter.Control', documentsAdvancedFilterController);
});


