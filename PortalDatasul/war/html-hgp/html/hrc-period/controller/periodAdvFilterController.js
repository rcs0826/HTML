define(['index',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
    '/dts/hgp/html/hrc-periodSituation/sitPerZoomController.js'
], function (index) {

    periodAdvFilterController.$inject = ['$rootScope', '$scope','$modalInstance','disclaimers', 'AbstractAdvancedFilterController','TOTVSEvent'];
    function periodAdvFilterController($rootScope, $scope, $modalInstance, disclaimers, AbstractAdvancedFilterController,TOTVSEvent) {

        var _self = this;
        this.model = {};
        
        this.disclaimers = disclaimers;

        _self.today = new Date();

        this.filtersConfig = [

            {property: 'dtAnorefIni',    title: 'Ano Inicial',         modelVar: 'dtAnorefIni'},
            {property: 'dtAnorefFim',    title: 'Ano Final'  ,         modelVar: 'dtAnorefFim'},
            {property: 'nrPerrefIni',    title: 'Período Inicial',     modelVar: 'nrPerrefIni'},
            {property: 'nrPerrefFim',    title: 'Período Final',       modelVar: 'nrPerrefFim'},
            {property: 'dtInicioPerIni', title: 'Data Inicial',        modelVar: 'dtInicioPerIni', isDate: true},
            {property: 'dtInicioPerFim', title: 'Data Final',          modelVar: 'dtInicioPerFim', isDate: true},
            {property: 'cdSitPer',       title: 'Situação do Período', modelVar: 'cdSitPer'},
            
           
        ];

        this.search = function () {

            var isValid = true;    

            if (   (!angular.isUndefined(_self.model.dtAnorefIni) && _self.model.dtAnorefIni !=='')
                && (!angular.isUndefined(_self.model.dtAnorefFim) && _self.model.dtAnorefFim !=='')
                && (_self.model.dtAnorefFim < _self.model.dtAnorefIni) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Ano Final deve ser maior que o Ano Inicial'
                });
            }
            if (   (!angular.isUndefined(_self.model.nrPerrefIni) && _self.model.nrPerrefIni !=='')
                && (!angular.isUndefined(_self.model.nrPerrefFim) && _self.model.nrPerrefFim !=='')
                && (_self.model.nrPerrefFim < _self.model.nrPerrefIni) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Período Final deve ser maior que o Período Inicial'
                });
            }
            if (   (!angular.isUndefined(_self.model.dtInicioPerIni) && _self.model.dtInicioPerIni !==null)
                && (!angular.isUndefined(_self.model.dtInicioPerFim) && _self.model.dtInicioPerFim !==null)
                && (_self.model.dtInicioPerFim < _self.model.dtInicioPerIni) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Data Final deve ser maior que a Data Inicial'
                });
            }
            if (isValid === true) {          

                var arrayLength = this.disclaimers.length - 1;
                for (var i = arrayLength ; i >= 0 ; i--) {
                    
                    if ( this.disclaimers[i].title.substring(0,this.disclaimers[i].title.indexOf(':')) === 'Ano' 
                       ||this.disclaimers[i].title.substring(0,this.disclaimers[i].title.indexOf(':')) === 'Período'){
                        this.disclaimers.splice(i, 1);
                    }
                }      
                this.constructDisclaimers();
                $modalInstance.close(this.disclaimers);
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

    index.register.controller('hrc.periodAdvFilter.Control', periodAdvFilterController);
});

