define(['index',
    '/dts/hgp/html/hcg-hrs-adjustmentPercentage/adjustmentPercentageFactory.js',
    '/dts/hgp/html/hcg-hrs-adjustmentPercentage/controller/adjustmentPercentageAdvancedFilterController.js',
    '/dts/hgp/html/js/util/HibernateTools.js',
    '/dts/hgp/html/js/util/StringTools.js',
    '/dts/hgp/html/hcg-hrs-adjustmentPercentage/maintenance/controller/adjustmentPercentageMaintenanceController.js',
    '/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
    '/dts/hgp/html/util/genericConfigController.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER - LIST
    // *************************************************************************************

    adjustmentPercentageListController.$inject = ['$rootScope', '$scope', 'totvs.app-main-view.Service',
                                                  'hrs.adjustmentPercentage.Factory','global.userConfigs.Factory',
                                                  '$modal','AbstractAdvancedFilterController','TOTVSEvent'];
    function adjustmentPercentageListController($rootScope, $scope, appViewService,adjustmentPercentageFactory,
                                                userConfigsFactory,$modal,AbstractAdvancedFilterController,TOTVSEvent) {

        var _self = this;
                    
        _self.cdProgramaCorrente = 'hrs.adjustmentPercentageList';
        _self.config = [];
        _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height";
        _self.disclaimers = [];
        _self.listOfAdjustmentPercentage = [];
        _self.listOfAdjustmentPercentageCount = 0;
        
        this.search = function (isMore) {
            
            var startAt = 0;
            _self.hasDoneSearch = false;
            this.listOfAdjustmentPercentageCount = 0;
            
            //Testa se a busca é normal, 
            //ou se é a busca de mais registros, 
            //se for a de mais registros, a busca começará do tamanho da lista (padrão:100)
            if (isMore) {
                startAt = this.listOfAdjustmentPercentage.length + 1;
            } else {
                _self.listOfAdjustmentPercentage = [];
            }
            
            //Testa se foi preenchido o campo de busca
            if ((!angular.isUndefined(_self.searchInputText))
                && _self.searchInputText !== ''){

                //Remove todos os disclaimers
                var arrayLength = _self.disclaimers.length - 1;
                for (var i = arrayLength ; i >= 0 ; i--) {
                    _self.disclaimers.splice(i, 1);
                }   

                // Separa o campo de busca por /
                var keyArray = this.searchInputText.split('/');
                if (keyArray.length > 1
                    && StringTools.hasOnlyNumbers(keyArray[0])
                    && StringTools.hasOnlyNumbers(keyArray[1])){

                    
                    _self.disclaimers.push({property:'numAno', title:'Ano: ' + keyArray[0], 
                        value:keyArray[0],priority:2});

                    _self.disclaimers.push({property:'numMes',title: 'Mês: ' 
                        + keyArray[1],
                        value:keyArray[1], priority:1});
                }else{
                    if(StringTools.hasOnlyNumbers(_self.searchInputText)){
                        _self.disclaimers.push({property:'numAno',title: 'Ano' + ': ' 
                            + _self.searchInputText,
                            value:_self.searchInputText, priority:1});
                    
                    }
                } 
            }

            //Limpa o campo de busca 
            _self.searchInputText = '';

            //Caso não possua disclaimers não realiza a busca
            /*if(_self.disclaimers.length == 0){
                return;
            }
            Comentado por se tratar de uma excessão
            */
           
            //Busca os periodos com os filtros informados, retornando o numero de registros configurados após o campo startAt
            adjustmentPercentageFactory.getAdjustmentPercentageByFilter('', startAt, parseInt(_self.config.qtdRegistrosBusca), true, _self.disclaimers, function (result) {
                _self.hasDoneSearch = true;
                //Se encontrou resultados, preenche a lista de periodos com os mesmos.
                if (result) {
                    angular.forEach(result, function (value) {

                        if (value && value.$length) {
                           _self.listOfAdjustmentPercentageCount = value.$length;
                        }
                        _self.listOfAdjustmentPercentage.push(value);
                    });
                    if (isMore === false) {
                        $('.page-wrapper').scrollTop(0);
                    }
                }
            });
        };    

        this.removeAdjustmentPercentage = function (selectedadjustmentPercentage) {

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
               title: 'Atenção!',
               text: 'Você realmente deseja remover o percentual abaixo?\n' + 
                     'Ano: ' + selectedadjustmentPercentage.numAno + '\n' +
                     'Mês: ' + selectedadjustmentPercentage.numMes + '\n' +
                     'Percentual: ' + selectedadjustmentPercentage.valPerc,
               cancelLabel: 'Não',
               confirmLabel: 'Sim',
               size: 'md',
               callback: function (hasChoosenYes) {
                   if (hasChoosenYes != true) 
                       return;

                   adjustmentPercentageFactory.removeAdjustmentPercentage(selectedadjustmentPercentage,
                   function (result) {

                       if(result.$hasError == true){
                           return;
                       }
                       
                       $rootScope.$broadcast(TOTVSEvent.showNotification, {
                           type: 'success', title: 'Registro removido com sucesso'
                       });
                       _self.search(false);
                   }); 
               }
            }); 
        };   

        this.openAdvancedSearch = function () {

            var advancedFilter = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hcg-hrs-adjustmentPercentage/ui/adjustmentPercentageAdvancedFilter.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hrs.adjustmentPercentageAdvFilter.Control as afController',
                resolve: {
                    disclaimers: function () {
                        return _self.disclaimers;
                    },
                    AbstractAdvancedFilterController : function(){
                        return AbstractAdvancedFilterController;
                    }
                }
            });
            
            advancedFilter.result.then(function (disclaimers) {
                _self.search(false);
            });
        };

        this.openConfigWindow = function () {

            var configWindow = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hcg-hrs-adjustmentPercentage/ui/adjustmentPercentageListConfiguration.html',
                size: 'sm',
                backdrop: 'static',
                controller: 'global.genericConfigController as controller',
                resolve: {
                    config: function () {
                        return angular.copy(_self.config);
                    },
                    programName: function(){
                        return _self.cdProgramaCorrente;
                    },
                    extensionFunctions: function(){
                        var funcs = {};
                        funcs.setCurrentFilterAsDefault = function(){
                            this.config.disclaimers = angular.copy(_self.disclaimers);
                        };     
                        return funcs;
                    }
                }
            });

            configWindow.result.then(function (config) {
                _self.config = angular.copy(config);
            });
        };

        this.init = function(){
            appViewService.startView("Percentuais de Reajuste", 'hrs.adjustmentPercentageList.Control', _self);
            
            if(appViewService.lastAction != 'newtab'){
                return;
            }
                          
            userConfigsFactory.getConfigByKey(
                $rootScope.currentuser.login, 
                _self.cdProgramaCorrente,
            function(result){
               if(angular.isUndefined(result) == true){
                    _self.config = {lgBuscarAoAbrirTela : true,
                                    qtdRegistrosBusca   : "20"};
                    _self.search(false);            
               }else{
                    _self.config = result.desConfig;
                    
                    if(_self.config.disclaimers){
                        _self.disclaimers = angular.copy(_self.config.disclaimers);
                    }
                    
                    if(_self.config.lgBuscarAoAbrirTela == true){
                        _self.search(false);
                   }
               }
            });       
        };

        this.removeDisclaimer = function (disclaimer) {

            // percorre os disclaimers até encontrar o disclaimer passado na função e o remove
            // obs.: Não funciona para mais de um disclaimer quando são apenas 2, 
            //       pois o length dos disclaimers usado no for é modificado assim
            //       que é removido o primeiro disclaimer
            for (var i = 0; i < _self.disclaimers.length; i++) {
                if (_self.disclaimers[i].property === disclaimer.property) {
                    _self.disclaimers.splice(i, 1);
                }
            }

            _self.search(false);
        };

        if ($rootScope.currentuserLoaded) {
            this.init();
        } else {
            $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
                _self.init();
            });
        }
    }
    index.register.controller('hrs.adjustmentPercentageList.Control', adjustmentPercentageListController);

});


