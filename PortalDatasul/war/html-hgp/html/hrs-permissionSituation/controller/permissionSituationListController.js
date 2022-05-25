define(['index',
    '/dts/hgp/html/js/util/HibernateTools.js',
    '/dts/hgp/html/js/util/StringTools.js',
    '/dts/hgp/html/hrs-permissionSituation/maintenance/controller/permissionSituationMaintenanceController.js',
    '/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
    '/dts/hgp/html/util/genericConfigController.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER - LIST
    // *************************************************************************************

    permissionSituationListController.$inject = ['$rootScope', '$scope', 'totvs.app-main-view.Service',
                                                  'hrs.permissionSituation.Factory','global.userConfigs.Factory',
                                                  '$modal','AbstractAdvancedFilterController','TOTVSEvent'];
    function permissionSituationListController($rootScope, $scope, appViewService,permissionSituationFactory,
                                                userConfigsFactory,$modal,AbstractAdvancedFilterController,TOTVSEvent) {

        var _self = this;

        _self.cdProgramaCorrente = 'hrs.permissionSituationList';
        _self.config = [];
        _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height";
        _self.disclaimers = [];
        _self.listOfPermissionSituation = [];
        _self.listOfPermissionSituationCount = 0;
        
        this.search = function (isMore) {
            var startAt = 0;
            _self.listOfPermissionSituationCount = 0;

            if (isMore) {
                startAt = _self.listOfPermissionSituation.length + 1;
            } else {
                _self.listOfPermissionSituation = [];
            }
            
            //Testa se foi preenchido o campo de busca
            if ((!angular.isUndefined(_self.searchInputText))
                && _self.searchInputText !== ''){

                //Remove todos os disclaimers
                var arrayLength = _self.disclaimers.length - 1;
                for (var i = arrayLength ; i >= 0 ; i--) {
                    _self.disclaimers.splice(i, 1);
                }   
                                
                _self.disclaimers.push({property:'codGrp',title: 'Grupo de usuários' + ': ' + 
                                        _self.searchInputText, value:_self.searchInputText, priority:1});

            }

            //Limpa o campo de busca 
            _self.searchInputText = '';            
           
            //Busca os periodos com os filtros informados, retornando o numero de registros configurados após o campo startAt
            permissionSituationFactory.getPermissionSituationByFilter('', startAt, parseInt(_self.config.qtdRegistrosBusca), true, true, _self.disclaimers, function (result) {
                _self.hasDoneSearch = true;
                //Se encontrou resultados, preenche a lista de periodos com os mesmos.
                if (result) {
                    angular.forEach(result, function (value) {

                        if (value && value.$length) {
                           _self.listOfPermissionSituationCount = value.$length;
                        }
                        _self.listOfPermissionSituation.push(value);
                    });
                    if (isMore === false) {
                        $('.page-wrapper').scrollTop(0);
                    }
                }
            });
        };     

        this.addEventListeners = function(){
          
            $rootScope.$on('invalidateSituation',function(event, changedSituation){
                if(!_self.listOfPermissionSituation 
                || _self.listOfPermissionSituation.length == 0){
                    return;
                }

                for (var i=0; i < _self.listOfPermissionSituation.length; i++) {
                    var permissionSituation = _self.listOfPermissionSituation[i];
                    var indAux = i;
                    
                    if(permissionSituation.idiAbiGrpUsuar == changedSituation.idiAbiGrpUsuar){
                        permissionSituationFactory.getPermissionSituationByFilter('', 0, 0, false, true, [{property:'codGrp', value: permissionSituation.codGrp, priority:1}],
                        function(result){
                                if(result){
                                    var permissionSituationAux = result[0];
                                    permissionSituationAux.$selected = permissionSituation.$selected;
                                    _self.listOfPermissionSituation[indAux] = permissionSituationAux;
                                }
                        }, {noCountRequest: true});
                        break;
                    }
                }
            });  
        };

        this.removeSituation = function (selectedpermissionSituation) {

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
               title: 'Atenção!',
               text: 'Você realmente deseja remover o registro selecionado?',
               cancelLabel: 'Não',
               confirmLabel: 'Sim',
               size: 'md',
               callback: function (hasChoosenYes) {
                   if (hasChoosenYes != true) 
                       return;

                   permissionSituationFactory.removePermissionSituation(selectedpermissionSituation,
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


        this.init = function(){
            appViewService.startView("Permissões de Grupos de Usuário", 'hrs.permissionSituationList.Control', _self);
                      
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
    index.register.controller('hrs.permissionSituationList.Control', permissionSituationListController);

});


