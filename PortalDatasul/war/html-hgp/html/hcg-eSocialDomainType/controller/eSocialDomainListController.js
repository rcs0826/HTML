define(['index',
    '/dts/hgp/html/hcg-eSocialDomainType/eSocialDomainTypeFactory.js',
    '/dts/hgp/html/js/util/HibernateTools.js',
    '/dts/hgp/html/js/util/StringTools.js',
    '/dts/hgp/html/hcg-eSocialDomainType/maintenance/controller/eSocialDomainMaintenanceController.js',
    '/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
    '/dts/hgp/html/util/genericConfigController.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER - LIST
    // *************************************************************************************

    eSocialDomainListController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'totvs.app-main-view.Service',
                                                  'hcg.eSocialDomainType.Factory','global.userConfigs.Factory',
                                                  '$modal','AbstractAdvancedFilterController','TOTVSEvent', '$location'];
    function eSocialDomainListController($rootScope, $scope, $state, $stateParams, appViewService,eSocialDomainTypeFactory,
                                                userConfigsFactory,$modal,AbstractAdvancedFilterController,TOTVSEvent, $location) {

        var _self = this;

        _self.cdProgramaCorrente = 'hcg.eSocialDomainList';
        _self.config = [];
        _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height";
        _self.disclaimers = [];
        _self.listOfESocialDomain = [];
        _self.domainType = {};
        _self.listOfESocialDomainCount = 0;
                                                            
        this.init = function(){
            
            appViewService.startView("Dados do Domínio", 'hcg.eSocialDomainList.Control', _self);
            
            if(appViewService.lastAction != 'newtab'
            && _self.currentUrl == $location.$$path){
                return;
            }
            
            _self.addEventListeners();

            _self.listOfESocialDomain = [];
            _self.currentUrl = $location.$$path; 
            _self.domainType = {};
            _self.listOfESocialDomainCount = 0;

            if (!angular.isUndefined($stateParams.idiTipDomin)){
                eSocialDomainTypeFactory.getDomainTypeById($stateParams.idiTipDomin, 
                    function (result) {
                    if (result) {
                        angular.forEach(result, function (value) {
                            _self.domainType = value;
                            _self.search(false);
                        });
                    }
                });
            }

        };

        this.removeDisclaimer = function (disclaimer) {

            // percorre os disclaimers ate encontrar o disclaimer passado na funçao e o remove
            // obs.: Nao funciona para mais de um disclaimer quando sao apenas 2, 
            //       pois o length dos disclaimers usado no for e modificado assim
            //       que e removido o primeiro disclaimer
            for (var i = 0; i < _self.disclaimers.length; i++) {
                if (_self.disclaimers[i].property === disclaimer.property) {
                    _self.disclaimers.splice(i, 1);
                }
            }

            _self.search(false);
        };

        this.search = function (isMore) {

            var startAt = 0;
            _self.listOfESocialDomainCount = 0;

            if (isMore) {
                startAt = _self.listOfESocialDomain.length + 1;
            } else {
                _self.listOfESocialDomain = [];
            }
            
            //Testa se foi preenchido o campo de busca
            if ((!angular.isUndefined(_self.searchInputText))
                && _self.searchInputText !== ''){

                
                //Remove todos os disclaimers
                _self.disclaimers = [];
                
                var filtro = this.searchInputText;
                if (isNaN(filtro)) {                    
                    _self.disclaimers.push({property: 'desDomin',
                                            value: filtro,
                                            title: 'Descrição: ' + filtro,
                                            priority: 1});
                } else {
                    _self.disclaimers.push({property: 'codDominEsocial',
                                            value: filtro,
                                            title: 'ID: ' + filtro,
                                            priority: 1});
                }
                _self.searchInputText = '';
            }

            eSocialDomainTypeFactory.getDomainByFilter(_self.domainType.idiTipDomin, _self.searchInputText, 0, 0, 0, _self.disclaimers,
                function (result) {
                if (result) {
                    if (result && result.length) {
                        _self.listOfESocialDomainCount = result.length;
                    }
                    _self.listOfESocialDomain = [];
                    angular.forEach(result, function (value) {
                        _self.listOfESocialDomain.push(value);
                    });
                    if (isMore === false) {
                        $('.page-wrapper').scrollTop(0);
                    }
                }
            });          
        };

        this.onCancel = function(){      
            appViewService.removeView({active: true,
                                        name  : "Dados do Domínio",
                                        url   : _self.currentUrl}); 
            return;
        };

        this.removeESocialDomain = function (eSocialDomain) {

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
               title: 'Atençao!',
               text: 'Você realmente deseja remover o registro selecionado?',
               cancelLabel: 'Nao',
               confirmLabel: 'Sim',
               size: 'md',
               callback: function (hasChoosenYes) {
                   if (hasChoosenYes != true) 
                       return;

                   eSocialDomainTypeFactory.removeESocialDomain(eSocialDomain,
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

        this.addEventListeners = function(){
            $rootScope.$on('invalidateESocialDomain',function(event, cdnDomin){

                if(!_self.listOfESocialDomain 
                || _self.listOfESocialDomain.length == 0){
                    return;
                }

                for (var i=0; i < _self.listOfESocialDomain.length; i++) {
                    var eSocialDomin = _self.listOfESocialDomain[i];
                    var indAux = i;
                    
                    if(eSocialDomin.cdnDomin == cdnDomin){
                        var auxDisclaimers = [{property:'cdnDomin', value: cdnDomin, priority:1}];
                        eSocialDomainTypeFactory.getDomainByFilter(_self.domainType.idiTipDomin, 
                                                                   "", 0, 0, 0, auxDisclaimers,
                                function(result){
                                if(result){
                                    var eSocialDominAux = result[0];
                                    _self.listOfESocialDomain[indAux] = eSocialDominAux;
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
    index.register.controller('hcg.eSocialDomainList.Control', eSocialDomainListController);

});


