define(['index',
    '/dts/hgp/html/hrc-period/controller/periodAdvFilterController.js',
    '/dts/hgp/html/hrc-period/periodFactory.js',
    '/dts/hgp/html/js/util/HibernateTools.js',
    '/dts/hgp/html/js/util/StringTools.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
    '/dts/hgp/html/util/genericConfigController.js',
    '/dts/hgp/html/global-userConfigs/userConfigsFactory.js'


], function (index) {
    
    periodListController.$inject = ['$rootScope', '$scope','totvs.app-main-view.Service',
        'hrc.period.Factory', '$modal' ,'AbstractAdvancedFilterController','global.userConfigs.Factory','TOTVSEvent', '$timeout'];
    function periodListController($rootScope, $scope,appViewService, periodFactory, 
                   $modal,AbstractAdvancedFilterController,userConfigsFactory,TOTVSEvent, $timeout) {

        var _self = this;
        $scope.StringTools = StringTools;
       
        this.listOfPeriod = [];
        this.listOfPeriodCount = 0;
        this.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height";
        this.disclaimers = [];
        
        this.openAdvancedSearch = function () {

            var advancedFilter = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrc-period/ui/periodAdvFilter.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hrc.periodAdvFilter.Control as afController',
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
                templateUrl: '/dts/hgp/html/hrc-period/ui/periodListConfiguration.html',
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


        this.removeDisclaimer = function (disclaimer) {

            // percorre os disclaimers at?? encontrar o disclaimer passado na fun????o e o remove
            // obs.: N??o funciona para mais de um disclaimer quando s??o apenas 2, 
            //       pois o length dos disclaimers usado no for ?? modificado assim
            //       que ?? removido o primeiro disclaimer

            for (var i = 0; i < _self.disclaimers.length; i++) {
                if (_self.disclaimers[i].property === disclaimer.property) {
                    _self.disclaimers.splice(i, 1);
                }
            }

            _self.search(false);
	};

        this.search = function (isMore) {
      
            var startAt = 0;
            _self.hasDoneSearch = false;
            this.listOfPeriodCount = 0;

            //Testa se a busca ?? normal, 
            //ou se ?? a busca de mais registros, 
            //se for a de mais registros, a busca come??ar?? do tamanho da lista (padr??o:100)
            if (isMore) {
                startAt = this.listOfPeriod.length;
            } else {
                this.listOfPeriod = [];
            }

            //Testa se foi preenchido o campo de busca
            if ((!angular.isUndefined(this.searchInputText))
                && this.searchInputText !== ''){

                //Remove todos os disclaimers
                var arrayLength = this.disclaimers.length - 1;
                for (var i = arrayLength ; i >= 0 ; i--) {
                    
                    this.disclaimers.splice(i, 1);
                    
                }   

                // Separa o campo de busca por /
                var keyArray = this.searchInputText.split('/');

                // Verifica quantos campos foram digitados
                // se foram digitados dois campos e sao apenas numeros
                // cria os disclaimers de ano e periodo
                if (keyArray.length > 1
                    && StringTools.hasOnlyNumbers(keyArray[0])
                    && StringTools.hasOnlyNumbers(keyArray[1])){

                    
                    _self.disclaimers.push({property:'dtAnoref',title:'Ano: ' + keyArray[0], 
                        value:keyArray[0],priority:2});

                    _self.disclaimers.push({property:'nrPerref',title: 'Per??odo: ' 
                        + keyArray[1],
                        value:keyArray[1], priority:1});
                }else{

                // Como foi digitado apenas um valor e' assumido que e' o periodo
                    if(StringTools.hasOnlyNumbers(this.searchInputText)){
                        _self.disclaimers.push({property:'dtAnoref',title:'Ano' + ': ' 
                        + new Date().getFullYear() , 
                        value:new Date().getFullYear(), priority:2});

                        _self.disclaimers.push({property:'nrPerref',title: 'Per??odo' + ': ' 
                            + this.searchInputText,
                            value:this.searchInputText, priority:1});
                    }

                }
                //Limpa o campo de busca 
                this.searchInputText = '';

            }

            //Caso n??o possua disclaimers n??o realiza a busca
            if(_self.disclaimers.length == 0){
                return;
            }
           
            //Busca os periodos com os filtros informados, retornando o numero de registros configurados ap??s o campo startAt
            periodFactory.getPeriodByFilter('', startAt, parseInt(_self.config.qtdRegistrosBusca), true, _self.disclaimers, function (result) {
                     _self.hasDoneSearch = true;
                    //Se encontrou resultados, preenche a lista de periodos com os mesmos.
                    if (result) {
                        angular.forEach(result, function (value) {
                            if (value && value.$length) {
                               _self.listOfPeriodCount = value.$length;
                            }
                            _self.listOfPeriod.push(value);
                        });
                        if (isMore === false) {
                            $('.page-wrapper').scrollTop(0);
                        }
                    }
            });

	};

        this.init = function () {
            appViewService.startView("Per??odos de Movimenta????o", 'hrc.periodList.Control', _self);

            //Testa se est?? abrindo a aba ou apenas retornando, 
            //se estiver retornando a aba,n??o faz a fun????o de inicializa????o
            if(appViewService.lastAction != 'newtab'){
                return;
            }

            _self.addEventListeners();
            
            _self.cdProgramaCorrente = 'hrc.periodList';
            _self.config = [];
            userConfigsFactory.getConfigByKey(
                    $rootScope.currentuser.login, 
                    _self.cdProgramaCorrente,
                function(result){
                   if(angular.isUndefined(result) == true){
                        _self.config = { lgBuscarAoAbrirTela  : true,
                                         qtdRegistrosBusca    : "20"};
                                    
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
        }

        this.removePeriod = function(dtAnoref,nrPerref){
            
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
               title: 'Aten????o!',
               text: 'Voc?? realmente deseja remover o per??odo ' + 
                   + dtAnoref + '/' + nrPerref + '?',
               cancelLabel: 'N??o',
               confirmLabel: 'Sim',
               size: 'md',
               callback: function (hasChoosenYes) {
                   if (hasChoosenYes != true) 
                       return;

                   periodFactory.removePeriod(dtAnoref, nrPerref,
                   function (result) {

                       if(result.$hasError == true){
                           return;
                       }
                       
                       $rootScope.$broadcast(TOTVSEvent.showNotification, {
                           type: 'success', title: 'Per??odo '
                                       +  dtAnoref + '/' + nrPerref
                                       +' removido com sucesso'
                       });
                       _self.search(false);
                   }); 
               }
            }); 
        }; 

        this.addEventListeners = function(){            

            $rootScope.$on('invalidatePeriod',function(event, changedPeriod){

                if(!_self.listOfPeriod
                || _self.listOfPeriod.length == 0){
                    return;
                }

                for (var i=0; i < _self.listOfPeriod.length; i++) {
                    var period = _self.listOfPeriod[i];
                    var indAux = i;

                    if(period.dtAnoref == changedPeriod.dtAnoref
                    && period.nrPerref == changedPeriod.nrPerref){                                               
                        periodFactory.getPeriodByFilter('', 0, 1, false, 
                                                        [{property: 'nrPerref', value: period.nrPerref, priority:1},
                                                         {property: 'dtAnoref', value: period.dtAnoref, priority:2}],
                            function (result) {
                                if(result){
                                    var periodAux = result[0];
                                    periodAux.$selected = period.$selected;

                                    $timeout(function(){
                                        _self.listOfPeriod[indAux] = periodAux;
                                    });
                                }
                        });
                        break;
                    }
                }
            });  
        };        

              
        if ($rootScope.currentuserLoaded) {
            this.init();
        } else {
            $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
                _self.init();
            });
        }
		
    }

    index.register.controller('hrc.periodList.Control', periodListController);

});
