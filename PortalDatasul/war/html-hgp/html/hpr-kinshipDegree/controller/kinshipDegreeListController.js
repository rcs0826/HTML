
define(['index',    
    '/dts/hgp/html/hpr-kinshipDegree/kinshipDegreeFactory.js',   
    '/dts/hgp/html/js/util/HibernateTools.js',
    '/dts/hgp/html/js/util/StringTools.js',
    '/dts/hgp/html/hpr-kinshipDegree/maintenance/controller/kinshipDegreeMaintenanceController.js',
    '/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
    '/dts/hgp/html/util/genericConfigController.js',    
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER - LIST
    // *************************************************************************************

    kinshipDegreeListController.$inject = ['$rootScope', '$scope', 'totvs.app-main-view.Service',
                                                  'hpr.kinshipDegree.Factory', 'global.userConfigs.Factory',
                                                  '$modal', 'TOTVSEvent'];
    function kinshipDegreeListController($rootScope, $scope, appViewService, kinshipDegreeFactory,
                                                userConfigsFactory,$modal, TOTVSEvent) {

        var _self = this;

        _self.cdProgramaCorrente = 'hpr.kinshipDegreeList';
        _self.config = [];
        _self.listItemInfoClasses    = "col-sm-4 col-md-4 col-lg-4 col-sm-height";
        _self.listItemInfoClassesObs = "col-sm-10 col-md-10 col-lg-10 col-sm-height";
        _self.disclaimers = [];
        _self.listOfKinshipDegree = [];
        _self.listOfKinshipDegreeCount = 0;
        
        this.search = function (isMore) {           

            var startAt = 0;
            _self.listOfKinshipDegreeCount = 0;

            if (isMore) {
                startAt = _self.listOfKinshipDegree.length + 1;
            } else {
                _self.listOfKinshipDegree = [];
            }
            
            //Testa se foi preenchido o campo de busca
            if ((!angular.isUndefined(_self.searchInputText))
                && _self.searchInputText !== ''){                

                //Remove todos os disclaimers
                var arrayLength = _self.disclaimers.length - 1;
                for (var i = arrayLength ; i >= 0 ; i--) {
                    _self.disclaimers.splice(i, 1);
                }

                var filtro = this.searchInputText;
                if (isNaN(filtro)) {                    
                    _self.disclaimers.push({property: 'dsGrauParentesco',
                                            value: filtro,
                                            title: 'Descrição: ' + filtro,
                                            priority: 1});
                } else {
                    _self.disclaimers.push({property: 'cdGrauParentesco',
                                            value: filtro,
                                            title: 'Código: ' + filtro,
                                            priority: 1});
                }
            }

            //Limpa o campo de busca 
            _self.searchInputText = '';                             
           
            //Busca os periodos com os filtros informados, retornando o numero de registros configurados após o campo startAt
            kinshipDegreeFactory.getKinshipDegreeByFilter('', startAt, parseInt(_self.config.qtdRegistrosBusca), true, _self.disclaimers, function (result) {
                _self.hasDoneSearch = true;
                //Se encontrou resultados, preenche a lista de periodos com os mesmos.
                if (result) {                  

                    angular.forEach(result, function (value) {

                        if (value && value.$length) {
                           _self.listOfKinshipDegreeCount = value.$length;
                        }
                        _self.listOfKinshipDegree.push(value);
                    });
                    if (isMore === false) {
                        $('.page-wrapper').scrollTop(0);
                    }
                }
            });
        };    

        this.removeKinshipDegree = function (selectedkinshipDegree) {

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
               title: 'Atenção!',
               text: 'Você realmente deseja remover o registro selecionado?',
               cancelLabel: 'Não',
               confirmLabel: 'Sim',
               size: 'md',
               callback: function (hasChoosenYes) {
                   if (hasChoosenYes != true) 
                       return;

                   kinshipDegreeFactory.removeKinshipDegree(selectedkinshipDegree,
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

        this.openConfigWindow = function () {

            var configWindow = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hpr-kinshipDegree/ui/kinshipDegreeListConfiguration.html',
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

            appViewService.startView("Graus de Parentesco", 'hpr.kinshipDegreeList.Control', _self);
                        
            if(appViewService.lastAction != 'newtab'){
                return;
            }

            _self.addEventListeners();
            
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

        this.addEventListeners = function(){
          
            $rootScope.$on('invalidateKinshipDegree',function(event, cdGrauParentesco){

                if(!_self.listOfKinshipDegree 
                || _self.listOfKinshipDegree.length == 0){
                    return;
                }                           

                kinshipDegreeFactory.getKinshipDegreeByFilter('', 0, 0, false,[
                        {property:'cdGrauParentesco', value: cdGrauParentesco, priority:1}
                    ],function(result){
                        if(result){                                                                

                            for (var i=0; i < _self.listOfKinshipDegree.length; i++) {
                            var regAux = _self.listOfKinshipDegree[i];                            
                            
                                if(regAux.cdGrauParentesco == cdGrauParentesco ){                                    

                                    _self.listOfKinshipDegree[i] = result[0];
                                    break;
                                }
                            }
                        }
                });
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
    index.register.controller('hpr.kinshipDegreeList.Control', kinshipDegreeListController);

});


